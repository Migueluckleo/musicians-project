"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { WizardShell } from "@/components/wizard/WizardShell";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Lock, Phone, Mail, Plus, Trash2, Shield } from "lucide-react";

interface ContactPoint { id: string; type: string; value: string; label: string | null }

interface Props {
  profile: { id: string; contactPoints: ContactPoint[] };
  stepIndex: number;
  totalSteps: number;
  prevStep: string;
  nextStep: string;
}

export function StepContactos({ profile, stepIndex, totalSteps, prevStep, nextStep }: Props) {
  const router = useRouter();
  const [contacts, setContacts] = useState<ContactPoint[]>(profile.contactPoints);
  const [newPhone, setNewPhone] = useState({ value: "", label: "" });
  const [adding, setAdding] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const emailContact = contacts.find((c) => c.type === "EMAIL");
  const phoneContacts = contacts.filter((c) => c.type === "PHONE");

  const handleAdd = async () => {
    if (!newPhone.value.trim()) return;
    setAdding(true);

    const res = await fetch(`/api/providers/${profile.id}/contact-points`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "PHONE",
        value: newPhone.value.trim(),
        label: newPhone.label.trim() || null,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      setContacts((prev) => [...prev, data.contactPoint]);
      setNewPhone({ value: "", label: "" });
    }
    setAdding(false);
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/providers/${profile.id}/contact-points/${id}`, {
      method: "DELETE",
    });
    if (res.ok) setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  const handleNext = async () => {
    if (phoneContacts.length === 0 && !emailContact) {
      setErrors({ general: "Agrega al menos un punto de contacto." });
      return;
    }
    setErrors({});
    setLoading(true);
    router.push(nextStep);
  };

  return (
    <WizardShell
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      title="Tus datos de contacto"
      subtitle="Solo los contratantes que paguen o se suscriban podrán ver esta información."
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

        {/* Protection badge */}
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
          <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-xs text-green-700">
            Tu información de contacto está protegida. Solo se revela tras un pago de{" "}
            <strong>$1 USD</strong> o con suscripción mensual.
          </p>
        </div>

        {/* Email (auto) */}
        <div>
          <h3 className="text-sm font-semibold text-airbnb-dark mb-3">
            Correo electrónico
          </h3>
          <div className="flex items-center gap-3 p-3.5 border border-airbnb-border rounded-xl bg-airbnb-bg-light">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-airbnb-border">
              <Mail className="w-4 h-4 text-airbnb-gray" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-airbnb-dark truncate">
                {emailContact?.value || "—"}
              </p>
              <p className="text-xs text-airbnb-gray">Tomado de tu cuenta</p>
            </div>
            <Lock className="w-4 h-4 text-airbnb-gray flex-shrink-0" />
          </div>
        </div>

        {/* Phone numbers */}
        <div>
          <h3 className="text-sm font-semibold text-airbnb-dark mb-3">
            Teléfonos
          </h3>

          {phoneContacts.length > 0 && (
            <div className="space-y-2 mb-3">
              {phoneContacts.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center gap-3 p-3.5 border border-airbnb-border rounded-xl"
                >
                  <div className="w-8 h-8 bg-airbnb-red-light rounded-lg flex items-center justify-center">
                    <Phone className="w-4 h-4 text-airbnb-red" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-airbnb-dark">{c.value}</p>
                    {c.label && (
                      <p className="text-xs text-airbnb-gray">{c.label}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-airbnb-gray" />
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="p-1.5 hover:bg-red-50 rounded-lg text-airbnb-gray hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add phone */}
          <div className="bg-airbnb-bg-light rounded-xl p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder="+52 55 1234 5678"
                value={newPhone.value}
                onChange={(e) => setNewPhone({ ...newPhone, value: e.target.value })}
              />
              <Input
                placeholder="Etiqueta (ej. WhatsApp)"
                value={newPhone.label}
                onChange={(e) => setNewPhone({ ...newPhone, label: e.target.value })}
              />
            </div>
            <Button
              onClick={handleAdd}
              loading={adding}
              disabled={!newPhone.value.trim()}
              size="sm"
              variant="outline"
              className="w-auto flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Agregar teléfono
            </Button>
          </div>
        </div>
      </div>
    </WizardShell>
  );
}
