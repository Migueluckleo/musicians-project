import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProviderCard } from "@/components/search/ProviderCard";
import { Heart } from "lucide-react";

export default async function SavedProvidersPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/iniciar-sesion");

  const saved = await db.savedProvider.findMany({
    where: { bookerUserId: session.user.id },
    orderBy: { savedAt: "desc" },
    include: {
      providerProfile: {
        include: {
          genres: { include: { genre: true } },
          eventTypes: { include: { eventType: true } },
        },
      },
    },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-airbnb-dark">Guardados</h1>
        <p className="mt-1 text-sm text-airbnb-gray">
          Perfiles que marcaste para comparar después.
        </p>
      </div>

      {saved.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {saved.map((item) => (
            <ProviderCard key={item.id} provider={item.providerProfile} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-airbnb-border bg-white p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-airbnb-red-light text-airbnb-red">
            <Heart className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-airbnb-dark">
            Aún no tienes proveedores guardados
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-airbnb-gray">
            Guarda perfiles mientras exploras para compararlos antes de desbloquear contacto.
          </p>
          <Link
            href="/proveedores"
            className="mt-5 inline-flex rounded-xl bg-airbnb-red px-5 py-3 text-sm font-semibold text-white"
          >
            Explorar músicos
          </Link>
        </div>
      )}
    </div>
  );
}
