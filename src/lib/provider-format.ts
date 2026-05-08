export const PROVIDER_TYPE_LABELS: Record<string, string> = {
  solo_artist: "Solista",
  band: "Banda",
  group: "Grupo",
  mariachi: "Mariachi",
  duo: "Dúo",
  dj: "DJ",
  choir: "Coro",
  classical_ensemble: "Ensamble clásico",
  jazz_group: "Grupo de jazz",
  other: "Otro",
};

export function getProviderTypeLabel(type: string, other?: string | null) {
  if (type === "other") return other || "Otro";
  return PROVIDER_TYPE_LABELS[type] || "Proveedor musical";
}

export function formatPriceReference(provider: {
  hourlyPrice: number | null;
  eventPrice: number | null;
}) {
  const prices = [provider.hourlyPrice, provider.eventPrice].filter(
    (price): price is number => typeof price === "number"
  );

  if (prices.length === 0) return "Precio por confirmar";

  const min = Math.min(...prices);
  const label = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(min);

  return `Desde ${label}`;
}

export function formatFullPrice(provider: {
  hourlyPrice: number | null;
  eventPrice: number | null;
}) {
  const parts: string[] = [];
  const formatter = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  });

  if (provider.hourlyPrice !== null) {
    parts.push(`${formatter.format(provider.hourlyPrice)} por hora`);
  }
  if (provider.eventPrice !== null) {
    parts.push(`${formatter.format(provider.eventPrice)} por evento`);
  }

  return parts.length > 0 ? parts.join(" · ") : "Precio por confirmar";
}
