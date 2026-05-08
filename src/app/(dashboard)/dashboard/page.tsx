import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import {
  User,
  Music2,
  Tag,
  Clock,
  List,
  DollarSign,
  Phone,
  Eye,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

const WIZARD_STEPS = [
  { key: "identidad", label: "Identidad artística", icon: User, href: "/wizard/identidad" },
  { key: "categorias", label: "Géneros y eventos", icon: Tag, href: "/wizard/categorias" },
  { key: "duraciones", label: "Duración de contratación", icon: Clock, href: "/wizard/duraciones" },
  { key: "repertorio", label: "Repertorio", icon: List, href: "/wizard/repertorio" },
  { key: "precios", label: "Precios", icon: DollarSign, href: "/wizard/precios" },
  { key: "contactos", label: "Puntos de contacto", icon: Phone, href: "/wizard/contactos" },
  { key: "preview", label: "Vista previa y publicación", icon: Eye, href: "/wizard/preview" },
];

function getCompletion(profile: {
  stageName: string;
  providerType: string;
  description: string;
  baseLocation: string;
  minDuration: number | null;
  maxDuration: number | null;
  hourlyPrice: number | null;
  eventPrice: number | null;
  genres: unknown[];
  eventTypes: unknown[];
  contactPoints: unknown[];
}) {
  const checks = [
    !!profile.stageName,
    !!profile.providerType,
    !!profile.description,
    !!profile.baseLocation,
    profile.genres.length > 0,
    profile.eventTypes.length > 0,
    profile.minDuration !== null && profile.maxDuration !== null,
    profile.hourlyPrice !== null || profile.eventPrice !== null,
    profile.contactPoints.length > 0,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const profile = await db.providerProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      genres: true,
      eventTypes: true,
      contactPoints: true,
    },
  });

  if (!profile) {
    const [savedCount, unlockCount, subscription] = await Promise.all([
      db.savedProvider.count({ where: { bookerUserId: session.user.id } }),
      db.contactUnlock.count({ where: { bookerUserId: session.user.id } }),
      db.subscription.findUnique({ where: { userId: session.user.id } }),
    ]);

    const hasActiveSubscription =
      subscription?.status === "ACTIVE" &&
      subscription.currentPeriodEnd &&
      subscription.currentPeriodEnd > new Date();

    return (
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-airbnb-dark mb-2">
          Hola, {session.user.name || "bienvenido"}
        </h1>
        <p className="text-airbnb-gray mb-8">
          Explora, guarda opciones y vuelve a tus contactos desbloqueados.
        </p>

        <div className="grid gap-4 sm:grid-cols-3">
          <Link href="/guardados" className="rounded-2xl border border-airbnb-border bg-white p-5 hover:shadow-card">
            <p className="text-2xl font-bold text-airbnb-dark">{savedCount}</p>
            <p className="mt-1 text-sm text-airbnb-gray">Guardados</p>
          </Link>
          <Link href="/contactos-desbloqueados" className="rounded-2xl border border-airbnb-border bg-white p-5 hover:shadow-card">
            <p className="text-2xl font-bold text-airbnb-dark">{unlockCount}</p>
            <p className="mt-1 text-sm text-airbnb-gray">Contactos desbloqueados</p>
          </Link>
          <Link href="/suscripcion" className="rounded-2xl border border-airbnb-border bg-white p-5 hover:shadow-card">
            <p className="text-lg font-bold text-airbnb-dark">
              {hasActiveSubscription ? "Activa" : "Inactiva"}
            </p>
            <p className="mt-1 text-sm text-airbnb-gray">Suscripción</p>
          </Link>
        </div>

        <Link
          href="/proveedores"
          className="mt-6 inline-flex items-center gap-2 bg-airbnb-red text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-airbnb-red-hover transition-colors"
        >
          <Music2 className="w-4 h-4" />
          Explorar músicos
        </Link>
        <Link
          href="/registrarse/proveedor"
          className="ml-0 mt-3 inline-flex items-center gap-2 rounded-xl border border-airbnb-border bg-white px-6 py-3.5 font-semibold text-airbnb-dark hover:bg-airbnb-bg-hover sm:ml-3 sm:mt-6"
        >
          Publicar mi perfil musical
        </Link>
      </div>
    );
  }

  const completion = getCompletion(profile);
  const isPublished = profile.status === "PUBLISHED";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-airbnb-dark">
          {profile.stageName ? `Hola, ${profile.stageName}` : `Hola, ${session.user.name || "músico"}`}
        </h1>
        <p className="text-airbnb-gray mt-1">
          {isPublished
            ? "Tu perfil está publicado y visible para contratantes."
            : "Completa tu perfil para que los contratantes puedan encontrarte."}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/proveedores"
            className="rounded-full border border-airbnb-border bg-white px-4 py-2 text-sm font-semibold text-airbnb-dark hover:bg-airbnb-bg-hover"
          >
            Explorar como contratante
          </Link>
          <Link
            href="/guardados"
            className="rounded-full border border-airbnb-border bg-white px-4 py-2 text-sm font-semibold text-airbnb-dark hover:bg-airbnb-bg-hover"
          >
            Ver guardados
          </Link>
        </div>
      </div>

      {/* Status card */}
      <div className="bg-white rounded-2xl border border-airbnb-border p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {isPublished ? (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-500" />
            )}
            <span className="font-semibold text-airbnb-dark">
              {isPublished ? "Perfil publicado" : "Perfil incompleto"}
            </span>
          </div>
          <span className="text-sm font-semibold text-airbnb-red">{completion}% completo</span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-airbnb-border rounded-full h-2 mb-5">
          <div
            className="bg-gradient-to-r from-airbnb-red to-[#E31C5F] h-2 rounded-full transition-all duration-500"
            style={{ width: `${completion}%` }}
          />
        </div>

        {/* Steps */}
        <div className="space-y-2">
          {WIZARD_STEPS.map(({ key, label, icon: Icon, href }) => {
            const done =
              (key === "identidad" && !!profile.stageName && !!profile.description && !!profile.baseLocation) ||
              (key === "categorias" && profile.genres.length > 0 && profile.eventTypes.length > 0) ||
              (key === "duraciones" && profile.minDuration !== null) ||
              (key === "repertorio" && true) || // optional
              (key === "precios" && (profile.hourlyPrice !== null || profile.eventPrice !== null)) ||
              (key === "contactos" && profile.contactPoints.length > 0) ||
              (key === "preview" && isPublished);

            return (
              <Link
                key={key}
                href={href}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-airbnb-bg-hover transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${done ? "bg-green-100" : "bg-airbnb-bg-light"}`}>
                    {done ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <Icon className="w-4 h-4 text-airbnb-gray" />
                    )}
                  </div>
                  <span className={`text-sm ${done ? "text-airbnb-dark" : "text-airbnb-gray"}`}>
                    {label}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-airbnb-gray opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-5 pt-5 border-t border-airbnb-border">
          <Link
            href={isPublished ? `/proveedores/${profile.id}` : "/wizard/identidad"}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-airbnb-red to-[#E31C5F] text-white font-semibold py-3.5 rounded-xl hover:opacity-90 transition-opacity"
          >
            {isPublished ? (
              <>
                <Eye className="w-4 h-4" />
                Ver mi perfil público
              </>
            ) : (
              <>
                <ArrowRight className="w-4 h-4" />
                Continuar completando perfil
              </>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
}
