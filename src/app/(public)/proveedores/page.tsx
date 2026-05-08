import Link from "next/link";
import { Navbar } from "@/components/ui/Navbar";
import { db } from "@/lib/db";
import { ProviderCard } from "@/components/search/ProviderCard";
import { SearchFilters } from "@/components/search/SearchFilters";
import { Music2, SearchX } from "lucide-react";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

interface ProvidersPageProps {
  searchParams: {
    genre?: string;
    event?: string;
    event_type?: string;
    q?: string;
    price_max?: string;
    page?: string;
  };
}

export default async function ProvidersPage({ searchParams }: ProvidersPageProps) {
  const query = (searchParams.q || "").trim();
  const genre = searchParams.genre || "";
  const eventType = searchParams.event_type || searchParams.event || "";
  const priceMax = searchParams.price_max || "";
  const page = Math.max(Number(searchParams.page || "1"), 1);
  const limit = 12;
  const querySlug = slugifySearch(query);

  const andFilters: Prisma.ProviderProfileWhereInput[] = [{ status: "PUBLISHED" }];

  if (query) {
    andFilters.push({
      OR: [
        { stageName: { contains: query } },
        { providerType: { contains: querySlug || query } },
        { providerTypeOther: { contains: query } },
        { description: { contains: query } },
        { baseLocation: { contains: query } },
        { genres: { some: { genre: { name: { contains: query } } } } },
        { eventTypes: { some: { eventType: { name: { contains: query } } } } },
        ...(querySlug
          ? [
              { genres: { some: { genre: { slug: { contains: querySlug } } } } },
              {
                eventTypes: {
                  some: { eventType: { slug: { contains: querySlug } } },
                },
              },
            ]
          : []),
      ],
    });
  }

  if (genre) {
    andFilters.push({
      genres: { some: { genre: { slug: genre } } },
    });
  }

  if (eventType) {
    andFilters.push({
      eventTypes: { some: { eventType: { slug: eventType } } },
    });
  }

  if (priceMax) {
    andFilters.push({
      OR: [
        { hourlyPrice: { lte: Number(priceMax) } },
        { eventPrice: { lte: Number(priceMax) } },
      ],
    });
  }

  const where: Prisma.ProviderProfileWhereInput = { AND: andFilters };

  const [providers, total, genres, eventTypes] = await Promise.all([
    db.providerProfile.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { updatedAt: "desc" },
      include: {
        genres: { include: { genre: true } },
        eventTypes: { include: { eventType: true } },
      },
    }),
    db.providerProfile.count({ where }),
    db.genre.findMany({ orderBy: { name: "asc" } }),
    db.eventType.findMany({ orderBy: { name: "asc" } }),
  ]);

  const totalPages = Math.max(Math.ceil(total / limit), 1);
  const currentSearch = new URLSearchParams(
    Object.entries(searchParams).filter(([, value]) => Boolean(value)) as [string, string][]
  ).toString();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold text-airbnb-red">Explora opciones</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-airbnb-dark">
              {query ? `Resultados para "${query}"` : "Músicos para tu evento"}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-airbnb-gray">
              {query
                ? "Mostramos coincidencias por nombre, género, evento, ciudad y descripción del proveedor."
                : "Compara perfiles, precios de referencia y repertorios sin ver datos de contacto hasta que decidas desbloquearlos."}
            </p>
          </div>
          <Link
            href="/como-funciona"
            className="text-sm font-semibold text-airbnb-dark underline hover:no-underline"
          >
            Cómo funciona el acceso al contacto
          </Link>
        </div>

        <section>
          <SearchFilters genres={genres} eventTypes={eventTypes} />
            <div className="mb-5 flex items-center justify-between gap-3">
              <p className="text-sm text-airbnb-gray">
                {total === 1 ? "1 proveedor publicado" : `${total} proveedores publicados`}
              </p>
              {currentSearch && (
                <Link
                  href="/proveedores"
                  className="text-sm font-semibold text-airbnb-dark underline hover:no-underline"
                >
                  Limpiar búsqueda
                </Link>
              )}
            </div>

            {providers.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
                  {providers.map((provider) => (
                    <ProviderCard
                      key={provider.id}
                      provider={provider}
                      search={currentSearch}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-10 flex items-center justify-center gap-3">
                    {page > 1 && (
                      <PageLink page={page - 1} searchParams={searchParams}>
                        Anterior
                      </PageLink>
                    )}
                    <span className="text-sm text-airbnb-gray">
                      Página {page} de {totalPages}
                    </span>
                    {page < totalPages && (
                      <PageLink page={page + 1} searchParams={searchParams}>
                        Siguiente
                      </PageLink>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-2xl border border-dashed border-airbnb-border bg-airbnb-bg-light p-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white">
                  {currentSearch ? (
                    <SearchX className="h-7 w-7 text-airbnb-red" />
                  ) : (
                    <Music2 className="h-7 w-7 text-airbnb-red" />
                  )}
                </div>
                <h2 className="mt-4 text-lg font-semibold text-airbnb-dark">
                  {query
                    ? "No encontramos proveedores con esa búsqueda"
                    : currentSearch
                      ? "No encontramos proveedores con esos filtros"
                      : "Aún no hay perfiles publicados"}
                </h2>
                <p className="mx-auto mt-2 max-w-md text-sm text-airbnb-gray">
                  {query
                    ? "Prueba con otro género, tipo de evento o ciudad para ver más opciones."
                    : currentSearch
                      ? "Prueba quitar algún filtro o ampliar tu presupuesto para ver más opciones."
                      : "Cuando un músico publique su perfil, aparecerá aquí para que puedas compararlo."}
                </p>
                {currentSearch && (
                  <Link
                    href="/proveedores"
                    className="mt-5 inline-flex rounded-xl bg-airbnb-dark px-5 py-3 text-sm font-semibold text-white"
                  >
                    Ver todos
                  </Link>
                )}
              </div>
            )}
        </section>
      </main>
    </div>
  );
}

function slugifySearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function PageLink({
  page,
  searchParams,
  children,
}: {
  page: number;
  searchParams: ProvidersPageProps["searchParams"];
  children: React.ReactNode;
}) {
  const params = new URLSearchParams(
    Object.entries({ ...searchParams, page: String(page) }).filter(([, value]) =>
      Boolean(value)
    ) as [string, string][]
  );

  return (
    <Link
      href={`/proveedores?${params.toString()}`}
      className="rounded-full border border-airbnb-border px-4 py-2 text-sm font-semibold text-airbnb-dark hover:bg-airbnb-bg-hover"
    >
      {children}
    </Link>
  );
}
