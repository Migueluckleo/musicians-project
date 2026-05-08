import Link from "next/link";
import { Navbar } from "@/components/ui/Navbar";
import { CheckCircle2, Lock, Search, ShieldCheck, Sparkles } from "lucide-react";

const STEPS = [
  {
    icon: Search,
    title: "Explora y compara",
    text: "Filtra por género, tipo de evento y presupuesto antes de tomar una decisión.",
  },
  {
    icon: Lock,
    title: "El contacto permanece protegido",
    text: "Los perfiles muestran información útil, pero nunca teléfonos o emails sin acceso autorizado.",
  },
  {
    icon: ShieldCheck,
    title: "Desbloquea solo cuando estés listo",
    text: "Paga $1 USD por un proveedor o activa la suscripción mensual para ver todos.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <section className="max-w-3xl">
          <p className="text-sm font-semibold text-airbnb-red">Cómo funciona</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-airbnb-dark">
            Encuentra músicos sin pagar antes de comparar
          </h1>
          <p className="mt-4 text-lg leading-8 text-airbnb-gray">
            Puedes revisar perfiles, repertorio, precios de referencia y condiciones
            básicas. El pago aparece solo cuando necesitas ver datos de contacto.
          </p>
        </section>

        <section className="mt-10 grid gap-4 md:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.title} className="rounded-2xl border border-airbnb-border p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-airbnb-red-light text-airbnb-red">
                <step.icon className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-base font-semibold text-airbnb-dark">{step.title}</h2>
              <p className="mt-2 text-sm leading-6 text-airbnb-gray">{step.text}</p>
            </div>
          ))}
        </section>

        <section className="mt-10 grid gap-5 rounded-3xl bg-airbnb-bg-light p-6 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-5">
            <h2 className="text-lg font-semibold text-airbnb-dark">Pago único</h2>
            <p className="mt-2 text-3xl font-bold text-airbnb-dark">$1 USD</p>
            <p className="mt-2 text-sm leading-6 text-airbnb-gray">
              Desbloquea únicamente el contacto del proveedor que estás viendo.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-airbnb-dark">
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                No se cobra dos veces por el mismo proveedor.
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                Ideal para una búsqueda puntual.
              </li>
            </ul>
          </div>

          <div className="rounded-2xl bg-white p-5">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-airbnb-dark">
              <Sparkles className="h-5 w-5 text-airbnb-red" />
              Suscripción mensual
            </h2>
            <p className="mt-2 text-3xl font-bold text-airbnb-dark">$9.99 USD</p>
            <p className="mt-2 text-sm leading-6 text-airbnb-gray">
              Acceso a los contactos de todos los proveedores mientras tu suscripción esté activa.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-airbnb-dark">
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                Pensada para planners, agencias y contratantes frecuentes.
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                Evita desbloquear proveedor por proveedor.
              </li>
            </ul>
          </div>
        </section>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/proveedores"
            className="inline-flex justify-center rounded-xl bg-airbnb-red px-6 py-3.5 text-sm font-semibold text-white hover:bg-airbnb-red-hover"
          >
            Buscar músicos
          </Link>
          <Link
            href="/registrarse/proveedor"
            className="inline-flex justify-center rounded-xl border border-airbnb-border px-6 py-3.5 text-sm font-semibold text-airbnb-dark hover:bg-airbnb-bg-hover"
          >
            Publicar mi perfil
          </Link>
        </div>
      </main>
    </div>
  );
}
