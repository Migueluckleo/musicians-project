"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { WizardShell } from "@/components/wizard/WizardShell";
import { Button } from "@/components/ui/Button";
import {
  CheckCircle2,
  Edit3,
  Eye,
  Lock,
  MapPin,
  Music2,
  Shield,
} from "lucide-react";

interface GenreItem {
  genre: { name: string };
}

interface EventTypeItem {
  eventType: { name: string };
}

interface Song {
  id: string;
  title: string;
  artist: string | null;
}

interface ContactPoint {
  id: string;
  type: string;
  value: string;
  label: string | null;
}

interface Props {
  profile: {
    id: string;
    stageName: string;
    providerType: string;
    providerTypeOther: string | null;
    description: string;
    baseLocation: string;
    minDuration: number | null;
    maxDuration: number | null;
    hourlyPrice: number | null;
    eventPrice: number | null;
    status: string;
    youtubeUrl: string | null;
    streamingUrl: string | null;
    demoAudioUrl: string | null;
    genres: GenreItem[];
    eventTypes: EventTypeItem[];
    repertoireSongs: Song[];
    contactPoints: ContactPoint[];
  };
  stepIndex: number;
  totalSteps: number;
  prevStep: string;
}

const PROVIDER_TYPE_LABELS: Record<string, string> = {
  solo_artist: "Solista",
  band: "Banda",
  mariachi: "Mariachi",
  duo: "Dúo",
  dj: "DJ",
  choir: "Coro",
  classical_ensemble: "Ensamble clásico",
  jazz_group: "Grupo de jazz",
  other: "Otro",
};

function getMissingItems(profile: Props["profile"]) {
  const missing: { label: string; href: string }[] = [];

  if (!profile.stageName || !profile.providerType || !profile.description || !profile.baseLocation) {
    missing.push({ label: "Completa tu identidad artística", href: "/wizard/identidad" });
  }
  if (profile.genres.length === 0 || profile.eventTypes.length === 0) {
    missing.push({ label: "Selecciona géneros y tipos de evento", href: "/wizard/categorias" });
  }
  if (profile.minDuration === null || profile.maxDuration === null) {
    missing.push({ label: "Define duración mínima y máxima", href: "/wizard/duraciones" });
  }
  if (profile.hourlyPrice === null && profile.eventPrice === null) {
    missing.push({ label: "Agrega al menos un precio", href: "/wizard/precios" });
  }
  if (profile.contactPoints.length === 0) {
    missing.push({ label: "Agrega al menos un punto de contacto", href: "/wizard/contactos" });
  }

  return missing;
}

export function StepPreview({ profile, stepIndex, totalSteps, prevStep }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [missing, setMissing] = useState(getMissingItems(profile));
  const publicType =
    profile.providerType === "other"
      ? profile.providerTypeOther || "Otro"
      : PROVIDER_TYPE_LABELS[profile.providerType] || "Proveedor musical";

  const publish = async () => {
    setLoading(true);
    setError("");

    const res = await fetch(`/api/providers/${profile.id}/publish`, {
      method: "POST",
    });
    const data = await res.json();

    setLoading(false);
    if (res.ok) {
      router.push("/dashboard");
      router.refresh();
      return;
    }

    setError(data.error || "No pudimos publicar tu perfil.");
    if (Array.isArray(data.missing)) {
      setMissing(
        data.missing.map((label: string) => ({
          label,
          href: "/wizard/identidad",
        }))
      );
    }
  };

  return (
    <WizardShell
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      title="Revisa tu perfil"
      subtitle="Así se verá la información pública. Tus contactos permanecen protegidos."
      prevStep={prevStep}
      onNext={publish}
      nextLabel={profile.status === "PUBLISHED" ? "Guardar y volver" : "Publicar perfil"}
      loading={loading}
    >
      <div className="space-y-5">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {missing.length > 0 && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-semibold text-amber-900">
              Falta información antes de publicar
            </p>
            <div className="mt-3 space-y-2">
              {missing.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-sm text-amber-900 hover:bg-amber-100"
                >
                  {item.label}
                  <Edit3 className="h-3.5 w-3.5" />
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-airbnb-border bg-white shadow-card">
          <div className="flex aspect-[16/7] items-center justify-center bg-airbnb-bg-light">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
              <Music2 className="h-8 w-8 text-airbnb-red" />
            </div>
          </div>

          <div className="space-y-6 p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-2xl font-bold text-airbnb-dark">
                    {profile.stageName || "Nombre artístico"}
                  </h2>
                  {profile.status === "PUBLISHED" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Publicado
                    </span>
                  )}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-airbnb-gray">
                  <span>{publicType}</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {profile.baseLocation || "Ubicación pendiente"}
                  </span>
                </div>
              </div>

              <Link
                href="/wizard/identidad"
                className="inline-flex items-center gap-2 text-sm font-semibold text-airbnb-dark underline hover:no-underline"
              >
                <Edit3 className="h-4 w-4" />
                Editar
              </Link>
            </div>

            <p className="whitespace-pre-line text-sm leading-6 text-airbnb-dark">
              {profile.description || "Tu descripción aparecerá aquí."}
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <PreviewSection title="Géneros" editHref="/wizard/categorias">
                {profile.genres.length > 0 ? (
                  <TagList items={profile.genres.map((item) => item.genre.name)} />
                ) : (
                  <EmptyText text="Sin géneros seleccionados." />
                )}
              </PreviewSection>

              <PreviewSection title="Eventos" editHref="/wizard/categorias">
                {profile.eventTypes.length > 0 ? (
                  <TagList items={profile.eventTypes.map((item) => item.eventType.name)} />
                ) : (
                  <EmptyText text="Sin tipos de evento seleccionados." />
                )}
              </PreviewSection>

              <PreviewSection title="Duración" editHref="/wizard/duraciones">
                <p className="text-sm text-airbnb-dark">
                  {profile.minDuration && profile.maxDuration
                    ? `${profile.minDuration} a ${profile.maxDuration} horas`
                    : "Pendiente"}
                </p>
              </PreviewSection>

              <PreviewSection title="Precios" editHref="/wizard/precios">
                <div className="space-y-1 text-sm text-airbnb-dark">
                  {profile.hourlyPrice !== null && <p>${profile.hourlyPrice} MXN / hora</p>}
                  {profile.eventPrice !== null && <p>${profile.eventPrice} MXN / evento</p>}
                  {profile.hourlyPrice === null && profile.eventPrice === null && (
                    <EmptyText text="Sin precio agregado." />
                  )}
                </div>
              </PreviewSection>
            </div>

            <PreviewSection title="Repertorio" editHref="/wizard/repertorio">
              {profile.repertoireSongs.length > 0 ? (
                <div className="divide-y divide-airbnb-border">
                  {profile.repertoireSongs.slice(0, 6).map((song) => (
                    <div key={song.id} className="flex items-center justify-between py-2 text-sm">
                      <span className="font-medium text-airbnb-dark">{song.title}</span>
                      {song.artist && <span className="text-airbnb-gray">{song.artist}</span>}
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyText text="Sin repertorio por ahora. Puedes publicarlo así y agregarlo después." />
              )}
            </PreviewSection>

            <PreviewSection title="Demos y muestras" editHref="/wizard/demos">
              {!profile.youtubeUrl && !profile.streamingUrl && !profile.demoAudioUrl ? (
                <EmptyText text="Sin demos agregados. Los contratantes confían más en perfiles con muestras." />
              ) : (
                <div className="space-y-2 text-sm text-airbnb-dark">
                  {profile.youtubeUrl && (
                    <p className="flex items-center gap-2">
                      <span className="text-red-500">▶</span> Video de YouTube agregado
                    </p>
                  )}
                  {profile.streamingUrl && (
                    <p className="flex items-center gap-2">
                      <span className="text-green-500">🎵</span> Enlace de plataforma de streaming agregado
                    </p>
                  )}
                  {profile.demoAudioUrl && (
                    <p className="flex items-center gap-2">
                      <span className="text-violet-500">🎙</span> Audio demo listo para reproducirse
                    </p>
                  )}
                </div>
              )}
            </PreviewSection>

            <div className="rounded-xl border border-airbnb-border bg-airbnb-bg-light p-4">
              <div className="flex items-start gap-3">
                <Shield className="mt-0.5 h-5 w-5 text-airbnb-red" />
                <div>
                  <p className="text-sm font-semibold text-airbnb-dark">
                    Contacto protegido
                  </p>
                  <p className="mt-1 text-sm text-airbnb-gray">
                    Los contratantes verán que tu contacto está bloqueado hasta pagar $1 USD
                    por este perfil o activar una suscripción mensual.
                  </p>
                  <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-airbnb-border bg-white px-3 py-1.5 text-xs font-semibold text-airbnb-dark">
                    <Lock className="h-3.5 w-3.5" />
                    {profile.contactPoints.length} punto
                    {profile.contactPoints.length === 1 ? "" : "s"} protegido
                    {profile.contactPoints.length === 1 ? "" : "s"}
                  </div>
                </div>
              </div>
            </div>

            <Button variant="outline" fullWidth className="gap-2" disabled>
              <Eye className="h-4 w-4" />
              Vista pública sin datos de contacto
            </Button>
          </div>
        </div>
      </div>
    </WizardShell>
  );
}

function PreviewSection({
  title,
  editHref,
  children,
}: {
  title: string;
  editHref: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-airbnb-border p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-airbnb-dark">{title}</h3>
        <Link href={editHref} className="text-xs font-semibold text-airbnb-gray underline">
          Editar
        </Link>
      </div>
      {children}
    </section>
  );
}

function TagList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full bg-airbnb-bg-light px-3 py-1 text-xs font-semibold text-airbnb-dark"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function EmptyText({ text }: { text: string }) {
  return <p className="text-sm text-airbnb-gray">{text}</p>;
}
