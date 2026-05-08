import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubscriptionActions } from "@/components/provider/SubscriptionActions";
import { CheckCircle2, Sparkles } from "lucide-react";

export default async function SubscriptionPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/iniciar-sesion");

  const subscription = await db.subscription.findUnique({
    where: { userId: session.user.id },
  });

  const isActive =
    subscription?.status === "ACTIVE" &&
    subscription.currentPeriodEnd &&
    subscription.currentPeriodEnd > new Date();

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <p className="text-sm font-semibold text-airbnb-red">Suscripción</p>
        <h1 className="mt-1 text-2xl font-bold text-airbnb-dark">
          Acceso a todos los contactos
        </h1>
        <p className="mt-2 text-sm leading-6 text-airbnb-gray">
          La suscripción mensual está pensada para quienes contratan músicos con frecuencia.
        </p>
      </div>

      <div className="rounded-3xl border border-airbnb-border bg-white p-6 shadow-card">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-airbnb-red-light text-airbnb-red">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-airbnb-dark">$9.99 USD / mes</h2>
            <p className="mt-2 text-sm leading-6 text-airbnb-gray">
              Accede a los datos de contacto de todos los proveedores publicados mientras
              tu suscripción esté activa. En modo local no se realiza ningún cobro real.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            "Contactos de todos los proveedores",
            "Sin pagar proveedor por proveedor",
            "Acceso inmediato mientras esté activa",
          ].map((benefit) => (
            <div key={benefit} className="flex gap-2 text-sm text-airbnb-dark">
              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
              {benefit}
            </div>
          ))}
        </div>

        {isActive && subscription?.currentPeriodEnd && (
          <div className="mt-6 rounded-xl bg-green-50 p-4 text-sm text-green-800">
            Tu suscripción está activa hasta el{" "}
            {subscription.currentPeriodEnd.toLocaleDateString("es-MX")}.
          </div>
        )}

        <SubscriptionActions isActive={Boolean(isActive)} />
      </div>
    </div>
  );
}
