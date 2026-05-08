import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { LockOpen, MapPin } from "lucide-react";
import { getProviderTypeLabel } from "@/lib/provider-format";

export default async function UnlockedContactsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/iniciar-sesion");

  const unlocks = await db.contactUnlock.findMany({
    where: { bookerUserId: session.user.id },
    orderBy: { unlockedAt: "desc" },
    include: { providerProfile: true },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-airbnb-dark">Contactos desbloqueados</h1>
        <p className="mt-1 text-sm text-airbnb-gray">
          Aquí puedes volver a los proveedores que ya desbloqueaste sin pagar otra vez.
        </p>
      </div>

      {unlocks.length > 0 ? (
        <div className="space-y-3">
          {unlocks.map((unlock) => (
            <Link
              key={unlock.id}
              href={`/proveedores/${unlock.providerProfile.id}`}
              className="flex items-center justify-between gap-4 rounded-2xl border border-airbnb-border bg-white p-4 hover:shadow-card"
            >
              <div>
                <h2 className="font-semibold text-airbnb-dark">
                  {unlock.providerProfile.stageName}
                </h2>
                <p className="mt-1 text-sm text-airbnb-gray">
                  {getProviderTypeLabel(
                    unlock.providerProfile.providerType,
                    unlock.providerProfile.providerTypeOther
                  )}
                </p>
                <p className="mt-1 flex items-center gap-1 text-xs text-airbnb-gray">
                  <MapPin className="h-3.5 w-3.5" />
                  {unlock.providerProfile.baseLocation}
                </p>
              </div>
              <div className="text-right text-xs text-airbnb-gray">
                <p>Desbloqueado</p>
                <p>{unlock.unlockedAt.toLocaleDateString("es-MX")}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-airbnb-border bg-white p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-airbnb-red-light text-airbnb-red">
            <LockOpen className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-airbnb-dark">
            Todavía no has desbloqueado contactos
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-airbnb-gray">
            Cuando desbloquees un proveedor, aparecerá aquí para que puedas volver sin pagar de nuevo.
          </p>
          <Link
            href="/proveedores"
            className="mt-5 inline-flex rounded-xl bg-airbnb-red px-5 py-3 text-sm font-semibold text-white"
          >
            Buscar proveedores
          </Link>
        </div>
      )}
    </div>
  );
}
