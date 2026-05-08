"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, Lock, Mail, Phone, Sparkles } from "lucide-react";

interface ContactAccessPanelProps {
  providerId: string;
  providerName: string;
}

interface ContactPoint {
  id: string;
  type: string;
  value: string;
  label: string | null;
}

export function ContactAccessPanel({
  providerId,
  providerName,
}: ContactAccessPanelProps) {
  const router = useRouter();
  const [contacts, setContacts] = useState<ContactPoint[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const checkAccess = async () => {
    setLoading(true);
    setMessage("");
    const res = await fetch(`/api/providers/${providerId}/contacts`);
    const data = await res.json();
    setLoading(false);

    if (res.status === 401) {
      router.push(`/iniciar-sesion?callbackUrl=/proveedores/${providerId}`);
      return;
    }

    if (res.ok) {
      setContacts(data.contacts || []);
      setMessage(
        data.accessType === "subscription"
          ? "Tu suscripción activa te da acceso a este contacto."
          : "Ya habías desbloqueado este contacto."
      );
      return;
    }

    setMessage(data.message || "El contacto está protegido.");
  };

  const unlockDemo = async () => {
    setLoading(true);
    setMessage("");
    const res = await fetch("/api/payments/unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ providerId }),
    });
    const data = await res.json();
    setLoading(false);

    if (res.status === 401) {
      router.push(`/iniciar-sesion?callbackUrl=/proveedores/${providerId}`);
      return;
    }

    if (res.ok) {
      setContacts(data.contacts || []);
      setMessage("Contacto desbloqueado en modo local. No se realizó ningún cobro real.");
      return;
    }

    setMessage(data.error || "No se pudo desbloquear el contacto.");
  };

  if (contacts.length > 0) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
        <div className="mb-4 flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-600" />
          <div>
            <h2 className="text-base font-semibold text-green-900">Contacto disponible</h2>
            <p className="mt-1 text-sm text-green-800">{message}</p>
          </div>
        </div>
        <div className="space-y-2">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-sm text-airbnb-dark"
            >
              {contact.type === "EMAIL" ? (
                <Mail className="h-4 w-4 text-airbnb-gray" />
              ) : (
                <Phone className="h-4 w-4 text-airbnb-gray" />
              )}
              <div>
                <p className="font-semibold">{contact.value}</p>
                <p className="text-xs text-airbnb-gray">
                  {contact.label || (contact.type === "EMAIL" ? "Email" : "Teléfono")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-airbnb-border bg-white p-5 shadow-card">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-airbnb-red-light text-airbnb-red">
          <Lock className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-airbnb-dark">
            Contacto protegido
          </h2>
          <p className="mt-1 text-sm leading-6 text-airbnb-gray">
            Revisa el perfil de {providerName} antes de pagar. Cuando estés listo,
            puedes desbloquear solo este contacto por $1 USD o suscribirte por
            $9.99 USD al mes para ver todos.
          </p>
        </div>
      </div>

      {message && (
        <div className="mt-4 rounded-xl bg-airbnb-bg-light p-3 text-sm text-airbnb-gray">
          {message}
        </div>
      )}

      <div className="mt-5 grid gap-3">
        <Button onClick={unlockDemo} loading={loading} fullWidth>
          Desbloquear este contacto · $1 USD
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/suscripcion")} fullWidth>
          <Sparkles className="mr-2 h-4 w-4" />
          Ver suscripción mensual
        </Button>
        <button
          type="button"
          onClick={checkAccess}
          className="text-sm font-semibold text-airbnb-dark underline hover:no-underline"
        >
          Ya pagué o tengo suscripción
        </button>
      </div>
    </div>
  );
}
