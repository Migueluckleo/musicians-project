"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface FilterOption {
  slug: string;
  name: string;
}

interface SearchFiltersProps {
  genres: FilterOption[];
  eventTypes: FilterOption[];
}

export function SearchFilters({ genres, eventTypes }: SearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [genre, setGenre] = useState(searchParams.get("genre") || "");
  const [eventType, setEventType] = useState(
    searchParams.get("event_type") || searchParams.get("event") || ""
  );
  const [priceMax, setPriceMax] = useState(searchParams.get("price_max") || "");
  const query = searchParams.get("q") || "";

  const activeCount = useMemo(
    () => [query, genre, eventType, priceMax].filter(Boolean).length,
    [query, genre, eventType, priceMax]
  );

  const apply = () => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (genre) params.set("genre", genre);
    if (eventType) params.set("event_type", eventType);
    if (priceMax) params.set("price_max", priceMax);
    router.push(`/proveedores${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const clear = () => {
    setGenre("");
    setEventType("");
    setPriceMax("");
    router.push("/proveedores");
  };

  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          aria-expanded={isOpen}
          className="inline-flex items-center gap-2 rounded-full border border-airbnb-border bg-white px-4 py-2.5 text-sm font-semibold text-airbnb-dark shadow-sm hover:bg-airbnb-bg-hover"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filtros
          {activeCount > 0 && (
            <span className="rounded-full bg-airbnb-red px-2 py-0.5 text-xs font-semibold text-white">
              {activeCount}
            </span>
          )}
        </button>

        {activeCount > 0 && (
          <button
            type="button"
            onClick={clear}
            className="inline-flex items-center gap-1 text-sm font-semibold text-airbnb-gray underline hover:text-airbnb-dark"
          >
            <X className="h-4 w-4" />
            Limpiar
          </button>
        )}
      </div>

      {isOpen && (
        <div className="mt-4 rounded-2xl border border-airbnb-border bg-white p-4 shadow-sm">
          <div className="grid gap-4 md:grid-cols-3">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-airbnb-dark">
                Género musical
              </span>
              <select
                value={genre}
                onChange={(event) => setGenre(event.target.value)}
                className="w-full rounded-xl border border-airbnb-border bg-white px-3 py-3 text-sm text-airbnb-dark focus:border-airbnb-dark focus:outline-none"
              >
                <option value="">Todos los géneros</option>
                {genres.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-airbnb-dark">
                Tipo de evento
              </span>
              <select
                value={eventType}
                onChange={(event) => setEventType(event.target.value)}
                className="w-full rounded-xl border border-airbnb-border bg-white px-3 py-3 text-sm text-airbnb-dark focus:border-airbnb-dark focus:outline-none"
              >
                <option value="">Todos los eventos</option>
                {eventTypes.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-airbnb-dark">
                Presupuesto máximo
              </span>
              <select
                value={priceMax}
                onChange={(event) => setPriceMax(event.target.value)}
                className="w-full rounded-xl border border-airbnb-border bg-white px-3 py-3 text-sm text-airbnb-dark focus:border-airbnb-dark focus:outline-none"
              >
                <option value="">Sin límite</option>
                <option value="1000">Hasta $1,000 MXN</option>
                <option value="3000">Hasta $3,000 MXN</option>
                <option value="7000">Hasta $7,000 MXN</option>
                <option value="15000">Hasta $15,000 MXN</option>
              </select>
              <span className="mt-1.5 block text-xs text-airbnb-gray">
                El precio es una referencia, no una cotización final.
              </span>
            </label>
          </div>

          <div className="mt-4 flex justify-end">
            <Button type="button" onClick={apply}>
              Aplicar filtros
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
