import Link from "next/link";
import { Navbar } from "@/components/ui/Navbar";
import { HomeSearchBox } from "@/components/search/HomeSearchBox";
import { ProviderCard } from "@/components/search/ProviderCard";
import { db } from "@/lib/db";
import { Music2, Mic2, Disc3, Piano } from "lucide-react";

export const dynamic = "force-dynamic";

const GENRES = [
  { slug: "mariachi", name: "Mariachi", icon: "🎺" },
  { slug: "banda", name: "Banda", icon: "🥁" },
  { slug: "jazz", name: "Jazz", icon: "🎷" },
  { slug: "pop", name: "Pop", icon: "🎤" },
  { slug: "rock", name: "Rock", icon: "🎸" },
  { slug: "clasica", name: "Clásica", icon: "🎻" },
  { slug: "salsa", name: "Salsa", icon: "💃" },
  { slug: "versatil", name: "Versátil", icon: "🎵" },
];

const PROVIDER_TYPES = [
  {
    title: "Grupos y Bandas",
    description: "Desde tríos hasta orquestas completas para cualquier evento",
    icon: <Music2 className="w-6 h-6" />,
    href: "/proveedores?type=band",
    color: "bg-rose-50 text-rose-600",
  },
  {
    title: "Solistas",
    description: "Artistas individuales con versatilidad y personalidad única",
    icon: <Mic2 className="w-6 h-6" />,
    href: "/proveedores?type=solo_artist",
    color: "bg-amber-50 text-amber-600",
  },
  {
    title: "DJs",
    description: "Música en vivo mezclada para mantener la energía toda la noche",
    icon: <Disc3 className="w-6 h-6" />,
    href: "/proveedores?type=dj",
    color: "bg-violet-50 text-violet-600",
  },
  {
    title: "Música Clásica",
    description: "Cuartetos, tríos y conjuntos para ceremonias y eventos formales",
    icon: <Piano className="w-6 h-6" />,
    href: "/proveedores?type=classical_ensemble",
    color: "bg-blue-50 text-blue-600",
  },
];

export default async function HomePage() {
  const featuredProviders = await db.providerProfile.findMany({
    where: { status: "PUBLISHED" },
    take: 8,
    orderBy: { updatedAt: "desc" },
    include: {
      genres: { include: { genre: true } },
      eventTypes: { include: { eventType: true } },
    },
  });

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-white to-orange-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-airbnb-dark leading-tight tracking-tight">
              El músico perfecto para{" "}
              <span className="text-airbnb-red">tu evento</span>
            </h1>
            <p className="mt-5 text-lg sm:text-xl text-airbnb-gray leading-relaxed">
              Más de 500 músicos, bandas y grupos listos para hacer memorable
              tu próxima ocasión especial.
            </p>

            <HomeSearchBox />

            {/* Quick tags */}
            <div className="mt-5 flex flex-wrap gap-2">
              {[
                { label: "Bodas", slug: "boda" },
                { label: "Quinceañeras", slug: "quinceañera" },
                { label: "Eventos corporativos", slug: "evento-corporativo" },
                { label: "Fiestas privadas", slug: "fiesta-privada" },
              ].map((tag) => (
                  <Link
                    key={tag.slug}
                    href={`/proveedores?event_type=${tag.slug}`}
                    className="text-xs font-medium border border-airbnb-border rounded-full px-3 py-1.5 text-airbnb-dark hover:bg-airbnb-bg-hover transition-colors"
                  >
                    {tag.label}
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* Genre pills */}
      <section className="border-b border-airbnb-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex gap-6 overflow-x-auto py-4 scrollbar-hide">
            {GENRES.map((g) => (
              <Link
                key={g.slug}
                href={`/proveedores?genre=${g.slug}`}
                className="flex flex-col items-center gap-1.5 flex-shrink-0 group pb-2 border-b-2 border-transparent hover:border-airbnb-dark transition-all"
              >
                <span className="text-2xl">{g.icon}</span>
                <span className="text-xs font-medium text-airbnb-gray group-hover:text-airbnb-dark whitespace-nowrap transition-colors">
                  {g.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured providers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-airbnb-dark">
            Músicos destacados
          </h2>
          <Link
            href="/proveedores"
            className="text-sm font-semibold text-airbnb-dark underline hover:no-underline"
          >
            Ver todos
          </Link>
        </div>

        {featuredProviders.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featuredProviders.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-airbnb-border bg-airbnb-bg-light p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white">
              <Music2 className="h-7 w-7 text-airbnb-red" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-airbnb-dark">
              Aún no hay músicos publicados
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-airbnb-gray">
              Cuando una banda o músico publique su perfil, aparecerá aquí para que puedas explorarlo.
            </p>
          </div>
        )}
      </section>

      {/* Type categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <h2 className="text-2xl font-bold text-airbnb-dark mb-6">
          Explora por tipo
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PROVIDER_TYPES.map((type) => (
            <Link
              key={type.title}
              href={type.href}
              className="group flex flex-col gap-3 p-5 rounded-2xl border border-airbnb-border hover:border-transparent hover:shadow-card-hover transition-all bg-white"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${type.color}`}>
                {type.icon}
              </div>
              <div>
                <h3 className="font-semibold text-airbnb-dark text-sm">
                  {type.title}
                </h3>
                <p className="text-xs text-airbnb-gray mt-1 leading-relaxed">
                  {type.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA for providers */}
      <section className="bg-airbnb-bg-light border-t border-airbnb-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 flex flex-col sm:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-airbnb-dark">
              ¿Eres músico o tienes una banda?
            </h2>
            <p className="mt-2 text-airbnb-gray max-w-md">
              Crea tu perfil, muestra tu repertorio y conecta con clientes que
              buscan exactamente lo que ofreces.
            </p>
          </div>
          <Link
            href="/registrarse/proveedor"
            className="flex-shrink-0 bg-airbnb-dark hover:bg-[#3a3a3a] text-white font-semibold px-8 py-4 rounded-xl transition-colors whitespace-nowrap"
          >
            Publica tu perfil — es gratis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-airbnb-border bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-airbnb-gray">
            <p>© 2026 Músicos MX. Todos los derechos reservados.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-airbnb-dark transition-colors">Privacidad</Link>
              <Link href="#" className="hover:text-airbnb-dark transition-colors">Términos</Link>
              <Link href="#" className="hover:text-airbnb-dark transition-colors">Ayuda</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
