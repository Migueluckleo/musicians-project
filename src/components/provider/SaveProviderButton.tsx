"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";

export function SaveProviderButton({
  providerId,
  compact = false,
}: {
  providerId: string;
  compact?: boolean;
}) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    setLoading(true);
    const res = await fetch(
      saved ? `/api/saved?providerId=${providerId}` : "/api/saved",
      {
        method: saved ? "DELETE" : "POST",
        headers: saved ? undefined : { "Content-Type": "application/json" },
        body: saved ? undefined : JSON.stringify({ providerId }),
      }
    );
    setLoading(false);

    if (res.status === 401) {
      router.push(`/iniciar-sesion?callbackUrl=/proveedores/${providerId}`);
      return;
    }

    if (res.ok) {
      setSaved((current) => !current);
      router.refresh();
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      aria-label={saved ? "Quitar de guardados" : "Guardar proveedor"}
      className={
        compact
          ? "inline-flex items-center gap-2 rounded-xl border border-airbnb-border bg-white px-4 py-2 text-sm font-semibold text-airbnb-dark hover:bg-airbnb-bg-hover disabled:opacity-50"
          : "flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-airbnb-dark shadow-sm hover:bg-white disabled:opacity-50"
      }
    >
      <Heart className={`h-4 w-4 ${saved ? "fill-airbnb-red text-airbnb-red" : ""}`} />
      {compact && (saved ? "Guardado" : "Guardar")}
    </button>
  );
}
