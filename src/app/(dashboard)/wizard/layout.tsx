import Link from "next/link";
import { Music2 } from "lucide-react";

const STEPS = [
  { slug: "identidad", label: "Identidad" },
  { slug: "categorias", label: "Categorías" },
  { slug: "duraciones", label: "Duración" },
  { slug: "repertorio", label: "Repertorio" },
  { slug: "precios", label: "Precios" },
  { slug: "contactos", label: "Contacto" },
  { slug: "preview", label: "Publicar" },
];

export default function WizardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b border-airbnb-border px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-airbnb-red rounded-lg flex items-center justify-center">
            <Music2 className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-airbnb-red text-xl tracking-tight hidden sm:block">
            músicos
          </span>
        </Link>
        <Link
          href="/dashboard"
          className="text-sm text-airbnb-gray hover:text-airbnb-dark transition-colors"
        >
          Guardar y salir
        </Link>
      </header>

      {/* Step indicators — desktop */}
      <div className="hidden sm:block border-b border-airbnb-border">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex">
            {STEPS.map((step, i) => (
              <Link
                key={step.slug}
                href={`/wizard/${step.slug}`}
                className="flex-1 flex flex-col items-center py-3 text-xs font-medium text-airbnb-gray hover:text-airbnb-dark transition-colors group"
              >
                <span className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center mb-1 text-xs group-hover:border-airbnb-dark">
                  {i + 1}
                </span>
                {step.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-xl">{children}</div>
      </div>
    </div>
  );
}
