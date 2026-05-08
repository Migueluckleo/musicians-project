"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { WizardShell } from "@/components/wizard/WizardShell";
import { Input } from "@/components/ui/Input";
import { AlertTriangle, ImagePlus, Music2 } from "lucide-react";

const PROVIDER_TYPES = [
  { value: "solo_artist", label: "Solista" },
  { value: "band", label: "Banda" },
  { value: "mariachi", label: "Mariachi" },
  { value: "duo", label: "Dúo" },
  { value: "dj", label: "DJ" },
  { value: "choir", label: "Coro" },
  { value: "classical_ensemble", label: "Ensamble Clásico" },
  { value: "jazz_group", label: "Grupo de Jazz" },
  { value: "other", label: "Otro" },
];

interface Props {
  profile: {
    id: string;
    stageName: string;
    providerType: string;
    providerTypeOther: string | null;
    description: string;
    baseLocation: string;
    imageUrl: string | null;
  };
  stepIndex: number;
  totalSteps: number;
  prevStep: string;
  nextStep: string;
}

export function StepIdentidad({ profile, stepIndex, totalSteps, prevStep, nextStep }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    stageName: profile.stageName || "",
    providerType: profile.providerType || "",
    providerTypeOther: profile.providerTypeOther || "",
    description: profile.description || "",
    baseLocation: profile.baseLocation || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [contactWarning, setContactWarning] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(profile.imageUrl || "");
  const [imageError, setImageError] = useState("");
  const [imageLoading, setImageLoading] = useState(false);

  const checkContact = (text: string) => {
    const patterns = [
      /(\+?[\d\s\-().]{7,20}\d)/,
      /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/,
      /(https?:\/\/[^\s]+|www\.[^\s]+)/,
      /@[a-zA-Z0-9_.]{2,}/,
    ];
    return patterns.some((p) => p.test(text));
  };

  const handleDescriptionChange = (val: string) => {
    setForm({ ...form, description: val });
    if (checkContact(val)) {
      setContactWarning(
        "Detectamos información de contacto en la descripción. Coloca teléfonos, emails o redes sociales en la sección de contacto protegido."
      );
    } else {
      setContactWarning("");
    }
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.stageName.trim()) e.stageName = "El nombre artístico es requerido.";
    if (!form.providerType) e.providerType = "Selecciona el tipo de proveedor.";
    if (!form.description.trim()) e.description = "La descripción es requerida.";
    if (form.description.trim().length < 30) e.description = "Escribe al menos 30 caracteres.";
    if (!form.baseLocation.trim()) e.baseLocation = "La ciudad o región es requerida.";
    if (contactWarning) e.description = "Elimina la información de contacto de la descripción.";
    return e;
  };

  const handleNext = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});
    setLoading(true);

    const res = await fetch(`/api/providers/${profile.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);
    if (res.ok) router.push(nextStep);
    else {
      const data = await res.json();
      setErrors({ general: data.error || "Error al guardar." });
    }
  };

  const handleImageUpload = async (file: File | undefined) => {
    if (!file) return;
    setImageError("");
    setImageLoading(true);

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(`/api/providers/${profile.id}/image`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setImageLoading(false);

    if (res.ok) {
      setImageUrl(data.profile.imageUrl);
      router.refresh();
    } else {
      setImageError(data.error || "No pudimos subir la imagen.");
    }
  };

  return (
    <WizardShell
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      title="Cuéntanos sobre ti"
      subtitle="Esta información aparecerá en tu perfil público."
      prevStep={prevStep}
      onNext={handleNext}
      loading={loading}
    >
      <div className="space-y-5">
        {errors.general && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            {errors.general}
          </div>
        )}

        <Input
          label="Nombre artístico o nombre de la banda"
          placeholder="Ej. Mariachi Real de México"
          value={form.stageName}
          onChange={(e) => setForm({ ...form, stageName: e.target.value })}
          error={errors.stageName}
        />

        <div className="rounded-2xl border border-airbnb-border p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex aspect-[4/3] w-full max-w-[180px] items-center justify-center overflow-hidden rounded-2xl bg-airbnb-bg-light">
              {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imageUrl} alt="Vista previa" className="h-full w-full object-cover" />
              ) : (
                <Music2 className="h-10 w-10 text-airbnb-red/60" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-airbnb-dark">Imagen principal</h3>
              <p className="mt-1 text-xs leading-5 text-airbnb-gray">
                Usa una foto clara y relacionada con tu presentación. JPG, PNG o WEBP,
                máximo 5 MB. Es opcional, pero ayuda a generar confianza.
              </p>
              <label className="mt-3 inline-flex cursor-pointer">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  onChange={(event) => handleImageUpload(event.target.files?.[0])}
                />
                <span className="inline-flex items-center justify-center gap-2 rounded-xl border border-airbnb-border bg-white px-4 py-2 text-sm font-semibold text-airbnb-dark hover:bg-airbnb-bg-hover">
                  <ImagePlus className="h-4 w-4" />
                  {imageLoading ? "Subiendo..." : "Subir imagen"}
                </span>
              </label>
              {imageError && <p className="mt-2 text-xs text-red-500">{imageError}</p>}
            </div>
          </div>
        </div>

        {/* Provider type */}
        <div>
          <label className="block text-sm font-medium text-airbnb-dark mb-2">
            Tipo de proveedor
          </label>
          <div className="grid grid-cols-3 gap-2">
            {PROVIDER_TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setForm({ ...form, providerType: t.value })}
                className={`px-3 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                  form.providerType === t.value
                    ? "border-airbnb-dark bg-airbnb-dark text-white"
                    : "border-airbnb-border text-airbnb-dark hover:border-airbnb-gray"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          {form.providerType === "other" && (
            <input
              className="mt-2 w-full px-4 py-3 border border-airbnb-border rounded-xl text-sm focus:outline-none focus:border-airbnb-dark"
              placeholder="Describe tu tipo de proveedor"
              value={form.providerTypeOther}
              onChange={(e) => setForm({ ...form, providerTypeOther: e.target.value })}
            />
          )}
          {errors.providerType && (
            <p className="mt-1.5 text-xs text-red-500">{errors.providerType}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-airbnb-dark mb-1.5">
            Descripción
          </label>
          <textarea
            rows={4}
            placeholder="Describe tu propuesta musical, estilo y qué tipo de eventos cubres. Ej: Somos un mariachi con 20 años de experiencia..."
            value={form.description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl text-sm text-airbnb-dark resize-none focus:outline-none focus:ring-1 transition-all ${
              contactWarning || errors.description
                ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                : "border-airbnb-border hover:border-airbnb-gray focus:border-airbnb-dark focus:ring-airbnb-border"
            }`}
          />
          <div className="flex items-center justify-between mt-1">
            <span className={`text-xs ${form.description.length < 30 ? "text-airbnb-gray" : "text-green-600"}`}>
              {form.description.length} / 30 mín.
            </span>
          </div>

          {contactWarning && (
            <div className="mt-2 flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">{contactWarning}</p>
            </div>
          )}
          {errors.description && !contactWarning && (
            <p className="mt-1.5 text-xs text-red-500">{errors.description}</p>
          )}
        </div>

        <Input
          label="Ciudad o región base"
          placeholder="Ej. Ciudad de México, CDMX"
          value={form.baseLocation}
          onChange={(e) => setForm({ ...form, baseLocation: e.target.value })}
          error={errors.baseLocation}
          hint="Indica desde dónde operas principalmente"
        />
      </div>
    </WizardShell>
  );
}
