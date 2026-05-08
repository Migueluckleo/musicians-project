"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { WizardShell } from "@/components/wizard/WizardShell";
import { Clock } from "lucide-react";

const HOURS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

interface Props {
  profile: { id: string; minDuration: number | null; maxDuration: number | null };
  stepIndex: number;
  totalSteps: number;
  prevStep: string;
  nextStep: string;
}

export function StepDuraciones({ profile, stepIndex, totalSteps, prevStep, nextStep }: Props) {
  const router = useRouter();
  const [min, setMin] = useState<number | null>(profile.minDuration);
  const [max, setMax] = useState<number | null>(profile.maxDuration);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    const e: Record<string, string> = {};
    if (!min) e.min = "Selecciona la duración mínima.";
    if (!max) e.max = "Selecciona la duración máxima.";
    if (min && max && min > max)
      e.general = "La duración mínima no puede ser mayor que la máxima.";
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});
    setLoading(true);

    const res = await fetch(`/api/providers/${profile.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ minDuration: min, maxDuration: max }),
    });

    setLoading(false);
    if (res.ok) router.push(nextStep);
    else setErrors({ general: "Error al guardar." });
  };

  return (
    <WizardShell
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      title="¿Cuánto tiempo tocas?"
      subtitle="Define la duración mínima y máxima por contratación."
      prevStep={prevStep}
      onNext={handleNext}
      loading={loading}
    >
      <div className="space-y-6">
        {errors.general && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            {errors.general}
          </div>
        )}

        {/* Visual range display */}
        {min && max && min <= max && (
          <div className="flex items-center gap-3 p-4 bg-airbnb-red-light rounded-xl">
            <Clock className="w-5 h-5 text-airbnb-red flex-shrink-0" />
            <p className="text-sm text-airbnb-red font-medium">
              Aceptas contrataciones de {min} a {max} hora{max !== 1 ? "s" : ""}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-6">
          {/* Min */}
          <div>
            <label className="block text-sm font-medium text-airbnb-dark mb-3">
              Mínimo
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {HOURS.map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => { setMin(h); setErrors({}); }}
                  className={`h-10 rounded-lg text-sm font-semibold border transition-all ${
                    min === h
                      ? "bg-airbnb-dark text-white border-airbnb-dark"
                      : "bg-white text-airbnb-dark border-airbnb-border hover:border-airbnb-gray"
                  }`}
                >
                  {h}h
                </button>
              ))}
            </div>
            {errors.min && <p className="mt-1.5 text-xs text-red-500">{errors.min}</p>}
          </div>

          {/* Max */}
          <div>
            <label className="block text-sm font-medium text-airbnb-dark mb-3">
              Máximo
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {HOURS.map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => { setMax(h); setErrors({}); }}
                  className={`h-10 rounded-lg text-sm font-semibold border transition-all ${
                    max === h
                      ? "bg-airbnb-dark text-white border-airbnb-dark"
                      : max && min && h < min
                      ? "opacity-30 cursor-not-allowed bg-white border-airbnb-border"
                      : "bg-white text-airbnb-dark border-airbnb-border hover:border-airbnb-gray"
                  }`}
                >
                  {h}h
                </button>
              ))}
            </div>
            {errors.max && <p className="mt-1.5 text-xs text-red-500">{errors.max}</p>}
          </div>
        </div>

        <p className="text-xs text-airbnb-gray">
          Puedes ajustar esto más adelante según cada evento.
        </p>
      </div>
    </WizardShell>
  );
}
