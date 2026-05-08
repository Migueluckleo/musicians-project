import Link from "next/link";
import { Lock, MapPin, Music2, Star } from "lucide-react";
import { SaveProviderButton } from "@/components/provider/SaveProviderButton";
import { formatPriceReference, getProviderTypeLabel } from "@/lib/provider-format";

interface ProviderCardProps {
  provider: {
    id: string;
    stageName: string;
    providerType: string;
    providerTypeOther?: string | null;
    description: string;
    baseLocation: string;
    imageUrl: string | null;
    hourlyPrice: number | null;
    eventPrice: number | null;
    genres: { genre: { name: string } }[];
    eventTypes: { eventType: { name: string } }[];
  };
  search?: string;
}

export function ProviderCard({ provider, search }: ProviderCardProps) {
  const href = `/proveedores/${provider.id}${search ? `?from=${encodeURIComponent(search)}` : ""}`;

  return (
    <div className="group relative">
      <Link href={href} className="block">
      <div className="overflow-hidden rounded-2xl bg-white">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-airbnb-bg-light">
          {provider.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={provider.imageUrl}
              alt={provider.stageName}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-rose-100 via-white to-amber-100">
              <Music2 className="h-12 w-12 text-airbnb-red/60" />
            </div>
          )}
          <div className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-airbnb-dark shadow-sm">
            {getProviderTypeLabel(provider.providerType, provider.providerTypeOther)}
          </div>
          <div className="absolute right-3 top-3">
            <SaveProviderButton providerId={provider.id} />
          </div>
        </div>

        <div className="pt-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-airbnb-dark">
                {provider.stageName}
              </h3>
              <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-airbnb-gray">
                <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                {provider.baseLocation}
              </p>
            </div>
            <div className="flex flex-shrink-0 items-center gap-1 text-xs font-medium text-airbnb-dark">
              <Star className="h-3.5 w-3.5 fill-airbnb-dark" />
              Nuevo
            </div>
          </div>

          <p className="mt-1 truncate text-xs text-airbnb-gray">
            {provider.genres.map((item) => item.genre.name).join(" · ") || "Género por confirmar"}
          </p>
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-airbnb-gray">
            {provider.description}
          </p>
          <div className="mt-2 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-airbnb-dark">
              {formatPriceReference(provider)}
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-airbnb-gray">
              <Lock className="h-3.5 w-3.5" />
              Contacto bloqueado
            </span>
          </div>
        </div>
      </div>
      </Link>
    </div>
  );
}
