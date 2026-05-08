"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function SubscriptionActions({ isActive }: { isActive: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const activate = async () => {
    setLoading(true);
    const res = await fetch("/api/subscriptions", { method: "POST" });
    const data = await res.json();
    setLoading(false);
    setMessage(data.message || "Suscripción actualizada.");
    router.refresh();
  };

  const cancel = async () => {
    setLoading(true);
    const res = await fetch("/api/subscriptions", { method: "DELETE" });
    const data = await res.json();
    setLoading(false);
    setMessage(data.message || "Suscripción actualizada.");
    router.refresh();
  };

  return (
    <div className="mt-6">
      {message && (
        <div className="mb-4 rounded-xl bg-airbnb-bg-light p-3 text-sm text-airbnb-gray">
          {message}
        </div>
      )}
      {isActive ? (
        <Button variant="outline" onClick={cancel} loading={loading} fullWidth>
          Cancelar suscripción local
        </Button>
      ) : (
        <Button onClick={activate} loading={loading} fullWidth>
          Activar suscripción local
        </Button>
      )}
    </div>
  );
}
