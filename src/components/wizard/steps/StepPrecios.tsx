"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { WizardShell } from "@/components/wizard/WizardShell";
import { Input } from "@/components/ui/Input";
import { DollarSign, Info } from "lucide-react";

interface Props {
  profile: { id: string; hourlyPrice: number | null; eventPrice: number | null };
  stepIndex: number;
  totalSteps: number;
  prevStep: string;
  nextStep: string;
}

export function StepPrecios({ profile, stepIndex, totalSteps, prevStep, nextStep }: Props) {
  const router = useRouter();
  const [hourlyPrice, setHourlyPrice] = useState(profile.hourlyPrice?.toString() || "");
  const [eventPrice, setEventPrice] = useState(profile.eventPrice?.toString() || "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    const e: Record<string, string> = {};
    if (!hourlyPrice && !eventPrice)
      e.general = "Define al menos un precio (por hora o por evento).";
    if (hourlyPrice && (isNaN(Number(hourlyPrice)) || Number(hourlyPrice) <= 0))
      e.hourly = "Ingresa un precio válido mayor a 0.";
    if (eventPrice && (isNaN(Number(eventPrice)) || Number(eventPrice) <= 0))
      e.event = "Ingresa un precio válido mayor a 0.";
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});
    setLoading(true);

    const res = await fetch(`/api/providers/${profile.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hourlyPrice: hourlyPrice ? Number(hourlyPrice) : null,
        eventPrice: eventPrice ? Number(eventPrice) : null,
      }),
    });

    setLoading(false);
    if (res.ok) router.push(nextStep);
    else setErrors({ general: "Error al guardar." });
  };

  return (
    <WizardShell
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      title="¿Cuánto cobras?"
      subtitle="Esta información es visible para los contratantes. Puedes indicar precio por hora, por evento, o ambos."
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

        {/* Hourly price */}
        <div className="p-5 border border-airbnb-border rounded-2xl space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-airbnb-dark">Precio por hora</h3>
              <p className="text-xs text-airbnb-gray mt-0.5">
                Ideal si cobras en función del tiempo de presentación.
              </p>
            </div>
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-airbnb-gray text-sm font-medium">
              $
            </span>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={hourlyPrice}
              onChange={(e) => setHourlyPrice(e.target.value)}
              className={`w-full pl-8 pr-16 py-3 border rounded-xl text-sm text-airbnb-dark focus:outline-none focus:ring-1 transition-all ${
                errors.hourly
                  ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                  : "border-airbnb-border hover:border-airbnb-gray focus:border-airbnb-dark focus:ring-airbnb-border"
              }`}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-airbnb-gray font-medium">
              MXN / hr
            </span>
          </div>
          {errors.hourly && (
            <p className="text-xs text-red-500">{errors.hourly}</p>
          )}
        </div>

        {/* Event price */}
        <div className="p-5 border border-airbnb-border rounded-2xl space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-airbnb-dark">Precio por evento</h3>
              <p className="text-xs text-airbnb-gray mt-0.5">
                Ideal si tienes una tarifa fija independientemente de las horas.
              </p>
            </div>
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-airbnb-gray text-sm font-medium">
              $
            </span>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={eventPrice}
              onChange={(e) => setEventPrice(e.target.value)}
              className={`w-full pl-8 pr-20 py-3 border rounded-xl text-sm text-airbnb-dark focus:outline-none focus:ring-1 transition-all ${
                errors.event
                  ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                  : "border-airbnb-border hover:border-airbnb-gray focus:border-airbnb-dark focus:ring-airbnb-border"
              }`}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-airbnb-gray font-medium">
              MXN / evento
            </span>
          </div>
          {errors.event && (
            <p className="text-xs text-red-500">{errors.event}</p>
          )}
        </div>

        <div className="flex items-start gap-2 text-xs text-airbnb-gray">
          <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          <p>
            Los precios se muestran como referencia. Los contratantes entienden que el costo
            final puede variar según las condiciones del evento.
          </p>
        </div>
      </div>
    </WizardShell>
  );
}
