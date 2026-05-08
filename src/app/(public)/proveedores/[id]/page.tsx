import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/ui/Navbar";
import { db } from "@/lib/db";
import { ContactAccessPanel } from "@/components/provider/ContactAccessPanel";
import { SaveProviderButton } from "@/components/provider/SaveProviderButton";
import { formatFullPrice, getProviderTypeLabel } from "@/lib/provider-format";
import { ArrowLeft, CheckCircle2, Clock, ExternalLink, MapPin, Music2, Play } from "lucide-react";

interface ProviderDetailProps {
  params: { id: string };
  searchParams: { from?: string };
}

export async function generateMetadata({
  params,
}: ProviderDetailProps): Promise<Metadata> {
  const profile = await db.providerProfile.findFirst({
    where: { id: params.id, status: "PUBLISHED" },
    select: { stageName: true, description: true },
  });

  if (!profile) return {};

  return {
    title: profile.stageName,
    description: profile.description,
  };
}

export default async function ProviderDetailPage({
  params,
  searchParams,
}: ProviderDetailProps) {
  const profile = await db.providerProfile.findFirst({
    where: { id: params.id, status: "PUBLISHED" },
    include: {
      genres: { include: { genre: true } },
      eventTypes: { include: { eventType: true } },
      repertoireSongs: { orderBy: { createdAt: "asc" } },
    },
  });

  function extractYoutubeId(url: string): string | null {
    try {
      const u = new URL(url);
      if (u.hostname === "youtu.be") return u.pathname.slice(1).split("?")[0];
      if (u.hostname.includes("youtube.com")) {
        const v = u.searchParams.get("v");
        if (v) return v;
        const embed = u.pathname.match(/\/embed\/([^/?]+)/);
        if (embed) return embed[1];
      }
    } catch {}
    return null;
  }

  function getStreamingPlatformLabel(url: string): string {
    try {
      const h = new URL(url).hostname.toLowerCase();
      if (h.includes("spotify")) return "Escuchar en Spotify";
      if (h.includes("soundcloud")) return "Escuchar en SoundCloud";
      if (h.includes("apple")) return "Escuchar en Apple Music";
      if (h.includes("tidal")) return "Escuchar en Tidal";
      if (h.includes("deezer")) return "Escuchar en Deezer";
      if (h.includes("bandcamp")) return "Escuchar en Bandcamp";
    } catch {}
    return "Escuchar en plataforma";
  }

  if (!profile) notFound();

  const backHref = searchParams.from
    ? `/proveedores?${searchParams.from}`
    : "/proveedores";

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <Link
          href={backHref}
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-airbnb-dark underline hover:no-underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a resultados
        </Link>

        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight text-airbnb-dark">
                {profile.stageName}
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Perfil completo
              </span>
            </div>
            <p className="mt-2 flex flex-wrap items-center gap-3 text-sm text-airbnb-gray">
              <span>{getProviderTypeLabel(profile.providerType, profile.providerTypeOther)}</span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {profile.baseLocation}
              </span>
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:items-end">
            <p className="text-lg font-semibold text-airbnb-dark">
              {formatFullPrice(profile)}
            </p>
            <SaveProviderButton providerId={profile.id} compact />
          </div>
        </div>

        <div className="relative mb-8 aspect-[16/7] overflow-hidden rounded-3xl bg-airbnb-bg-light">
          {profile.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.imageUrl}
              alt={profile.stageName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-rose-100 via-white to-amber-100">
              <Music2 className="h-16 w-16 text-airbnb-red/60" />
            </div>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-airbnb-dark">Descripción</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-airbnb-dark">
                {profile.description}
              </p>
            </section>

            <section className="grid gap-4 sm:grid-cols-2">
              <InfoBox title="Géneros musicales">
                <TagList items={profile.genres.map((item) => item.genre.name)} />
              </InfoBox>
              <InfoBox title="Eventos que cubre">
                <TagList items={profile.eventTypes.map((item) => item.eventType.name)} />
              </InfoBox>
              <InfoBox title="Duración">
                <p className="flex items-center gap-2 text-sm text-airbnb-dark">
                  <Clock className="h-4 w-4 text-airbnb-gray" />
                  De {profile.minDuration} a {profile.maxDuration} horas
                </p>
              </InfoBox>
              <InfoBox title="Precio de referencia">
                <p className="text-sm text-airbnb-dark">{formatFullPrice(profile)}</p>
                <p className="mt-1 text-xs text-airbnb-gray">
                  El precio final puede variar según fecha, lugar y condiciones del evento.
                </p>
              </InfoBox>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-airbnb-dark">Repertorio</h2>
              {profile.repertoireSongs.length > 0 ? (
                <div className="mt-4 overflow-hidden rounded-2xl border border-airbnb-border">
                  {profile.repertoireSongs.slice(0, 20).map((song) => (
                    <div
                      key={song.id}
                      className="flex items-center justify-between gap-4 border-b border-airbnb-border px-4 py-3 last:border-b-0"
                    >
                      <p className="text-sm font-semibold text-airbnb-dark">{song.title}</p>
                      {song.artist && (
                        <p className="text-sm text-airbnb-gray">{song.artist}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-4 rounded-2xl border border-dashed border-airbnb-border bg-airbnb-bg-light p-6 text-sm text-airbnb-gray">
                  Este proveedor aún no ha agregado su repertorio.
                </div>
              )}
            </section>

            {/* Demos section — only render if at least one media item is present */}
            {(profile.youtubeUrl || profile.streamingUrl || profile.demoAudioUrl) && (
              <section>
                <h2 className="text-xl font-semibold text-airbnb-dark">Demos</h2>
                <div className="mt-4 space-y-5">

                  {/* YouTube embed */}
                  {profile.youtubeUrl && extractYoutubeId(profile.youtubeUrl) && (
                    <div className="overflow-hidden rounded-2xl border border-airbnb-border bg-black" style={{ aspectRatio: "16/9" }}>
                      <iframe
                        src={`https://www.youtube.com/embed/${extractYoutubeId(profile.youtubeUrl)}`}
                        title={`Video de ${profile.stageName}`}
                        className="h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}

                  {/* Audio demo player */}
                  {profile.demoAudioUrl && (
                    <div className="flex items-center gap-3 rounded-2xl border border-airbnb-border p-4">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-violet-50">
                        <Play className="h-5 w-5 text-violet-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-airbnb-dark mb-1">Audio demo</p>
                        <audio controls src={profile.demoAudioUrl} className="w-full" />
                      </div>
                    </div>
                  )}

                  {/* Streaming platform link */}
                  {profile.streamingUrl && (
                    <a
                      href={profile.streamingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-3 rounded-2xl border border-airbnb-border p-4 hover:bg-airbnb-bg-light transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-green-50">
                          <Music2 className="h-5 w-5 text-green-600" />
                        </div>
                        <p className="text-sm font-semibold text-airbnb-dark">
                          {getStreamingPlatformLabel(profile.streamingUrl)}
                        </p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-airbnb-gray group-hover:text-airbnb-dark transition-colors" />
                    </a>
                  )}

                </div>
              </section>
            )}
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <ContactAccessPanel providerId={profile.id} providerName={profile.stageName} />
          </aside>
        </div>
      </main>
    </div>
  );
}

function InfoBox({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-airbnb-border p-4">
      <h3 className="mb-3 text-sm font-semibold text-airbnb-dark">{title}</h3>
      {children}
    </div>
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
