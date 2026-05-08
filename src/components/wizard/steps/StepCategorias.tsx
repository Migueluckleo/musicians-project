"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { WizardShell } from "@/components/wizard/WizardShell";

const GENRES = [
  { slug: "regional-mexicano", name: "Regional Mexicano", icon: "🎺" },
  { slug: "mariachi", name: "Mariachi", icon: "🪗" },
  { slug: "norteno", name: "Norteño", icon: "🎸" },
  { slug: "banda", name: "Banda", icon: "🥁" },
  { slug: "pop", name: "Pop", icon: "🎤" },
  { slug: "rock", name: "Rock", icon: "⚡" },
  { slug: "jazz", name: "Jazz", icon: "🎷" },
  { slug: "clasica", name: "Clásica", icon: "🎻" },
  { slug: "salsa", name: "Salsa", icon: "💃" },
  { slug: "cumbia", name: "Cumbia", icon: "🪘" },
  { slug: "reggaeton", name: "Reggaetón", icon: "🔊" },
  { slug: "versatil", name: "Versátil", icon: "🎵" },
  { slug: "electronica", name: "Electrónica", icon: "🎧" },
  { slug: "acustica", name: "Acústica", icon: "🪕" },
  { slug: "blues", name: "Blues", icon: "🎼" },
  { slug: "tropical", name: "Tropical", icon: "🌴" },
  { slug: "grupero", name: "Grupero", icon: "🎶" },
  { slug: "otro", name: "Otro", icon: "🎙️" },
];

const EVENT_TYPES = [
  { slug: "boda", name: "Boda", icon: "💍" },
  { slug: "quinceañera", name: "Quinceañera", icon: "👑" },
  { slug: "cumpleanos", name: "Cumpleaños", icon: "🎂" },
  { slug: "evento-corporativo", name: "Corporativo", icon: "🏢" },
  { slug: "bar-restaurante", name: "Bar / Restaurante", icon: "🍸" },
  { slug: "serenata", name: "Serenata", icon: "🌹" },
  { slug: "fiesta-privada", name: "Fiesta Privada", icon: "🎉" },
  { slug: "festival", name: "Festival", icon: "🎪" },
  { slug: "evento-religioso", name: "Religioso", icon: "⛪" },
  { slug: "graduacion", name: "Graduación", icon: "🎓" },
  { slug: "aniversario", name: "Aniversario", icon: "💫" },
  { slug: "hotel", name: "Hotel", icon: "🏨" },
  { slug: "otro", name: "Otro", icon: "📋" },
];

interface ProfileGenre { genre: { slug: string } }
interface ProfileEventType { eventType: { slug: string } }

interface Props {
  profile: {
    id: string;
    genres: ProfileGenre[];
    eventTypes: ProfileEventType[];
  };
  stepIndex: number;
  totalSteps: number;
  prevStep: string;
  nextStep: string;
}

export function StepCategorias({ profile, stepIndex, totalSteps, prevStep, nextStep }: Props) {
  const router = useRouter();
  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    profile.genres.map((g) => g.genre.slug)
  );
  const [selectedEvents, setSelectedEvents] = useState<string[]>(
    profile.eventTypes.map((e) => e.eventType.slug)
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const toggle = (
    slug: string,
    list: string[],
    setList: (l: string[]) => void
  ) => {
    setList(list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug]);
  };

  const handleNext = async () => {
    const e: Record<string, string> = {};
    if (selectedGenres.length === 0) e.genres = "Selecciona al menos un género.";
    if (selectedEvents.length === 0) e.events = "Selecciona al menos un tipo de evento.";
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});
    setLoading(true);

    const [r1, r2] = await Promise.all([
      fetch(`/api/providers/${profile.id}/genres`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ genres: selectedGenres }),
      }),
      fetch(`/api/providers/${profile.id}/event-types`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventTypes: selectedEvents }),
      }),
    ]);

    setLoading(false);
    if (r1.ok && r2.ok) router.push(nextStep);
    else setErrors({ general: "Error al guardar. Intenta de nuevo." });
  };

  return (
    <WizardShell
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      title="¿Qué música tocas?"
      subtitle="Selecciona los géneros y tipos de evento que cubres."
      prevStep={prevStep}
      onNext={handleNext}
      loading={loading}
    >
      <div className="space-y-7">
        {errors.general && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            {errors.general}
          </div>
        )}

        {/* Genres */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-airbnb-dark">Géneros musicales</h3>
            <span className="text-xs text-airbnb-gray">{selectedGenres.length} seleccionados</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {GENRES.map((g) => (
              <button
                key={g.slug}
                type="button"
                onClick={() => toggle(g.slug, selectedGenres, setSelectedGenres)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium border transition-all ${
                  selectedGenres.includes(g.slug)
                    ? "border-airbnb-dark bg-airbnb-dark text-white"
                    : "border-airbnb-border text-airbnb-dark hover:border-airbnb-gray bg-white"
                }`}
              >
                <span>{g.icon}</span>
                {g.name}
              </button>
            ))}
          </div>
          {errors.genres && (
            <p className="mt-2 text-xs text-red-500">{errors.genres}</p>
          )}
        </div>

        {/* Event types */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-airbnb-dark">Tipos de evento</h3>
            <span className="text-xs text-airbnb-gray">{selectedEvents.length} seleccionados</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {EVENT_TYPES.map((e) => (
              <button
                key={e.slug}
                type="button"
                onClick={() => toggle(e.slug, selectedEvents, setSelectedEvents)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium border transition-all ${
                  selectedEvents.includes(e.slug)
                    ? "border-airbnb-red bg-airbnb-red text-white"
                    : "border-airbnb-border text-airbnb-dark hover:border-airbnb-gray bg-white"
                }`}
              >
                <span>{e.icon}</span>
                {e.name}
              </button>
            ))}
          </div>
          {errors.events && (
            <p className="mt-2 text-xs text-red-500">{errors.events}</p>
          )}
        </div>
      </div>
    </WizardShell>
  );
}
