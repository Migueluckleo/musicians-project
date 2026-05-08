"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";

const BENEFITS = [
  "Perfil visible para miles de contratantes",
  "Sube tu repertorio completo en segundos",
  "Tú controlas quién ve tu información de contacto",
];

export default function ProviderRegisterPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Tu nombre es requerido.";
    if (!form.email.trim()) e.email = "El email es requerido.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Ingresa un email válido.";
    if (form.password.length < 8)
      e.password = "La contraseña debe tener al menos 8 caracteres.";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    const fieldErrors = validate();
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
          role: "PROVIDER",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setApiError(data.error || "Error al crear la cuenta.");
        setLoading(false);
        return;
      }

      // Auto sign in
      const signInResult = await signIn("credentials", {
        email: form.email.trim().toLowerCase(),
        password: form.password,
        redirect: false,
      });

      if (signInResult?.ok) {
        router.push("/wizard/identidad");
        router.refresh();
      } else {
        router.push("/iniciar-sesion");
      }
    } catch {
      setApiError("Error de conexión. Intenta de nuevo.");
      setLoading(false);
    }
  };

  const handleStartFromCurrentAccount = async () => {
    setApiError("");
    setLoading(true);

    try {
      const res = await fetch("/api/providers/start", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        setApiError(data.error || "No pudimos activar tu perfil musical.");
        setLoading(false);
        return;
      }

      router.push("/wizard/identidad");
      router.refresh();
    } catch {
      setApiError("Error de conexión. Intenta de nuevo.");
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-airbnb-dark">
          Publica tu perfil musical
        </h1>
        <p className="mt-1 text-sm text-airbnb-gray">
          Es gratis y tarda menos de 5 minutos
        </p>

        {/* Benefits */}
        <div className="mt-4 space-y-2">
          {BENEFITS.map((b) => (
            <div key={b} className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-airbnb-red flex-shrink-0 mt-0.5" />
              <span className="text-xs text-airbnb-gray">{b}</span>
            </div>
          ))}
        </div>
      </div>

      {apiError && (
        <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          {apiError}
        </div>
      )}

      {status === "authenticated" && session?.user ? (
        <div className="space-y-5">
          <div className="rounded-2xl border border-airbnb-border bg-airbnb-bg-light p-5">
            <p className="text-sm font-semibold text-airbnb-dark">
              Usaremos los datos de tu cuenta actual
            </p>
            <div className="mt-3 space-y-2 text-sm text-airbnb-gray">
              <p>
                <span className="font-medium text-airbnb-dark">Nombre:</span>{" "}
                {session.user.name || "Pendiente"}
              </p>
              <p>
                <span className="font-medium text-airbnb-dark">Email protegido:</span>{" "}
                {session.user.email}
              </p>
            </div>
            <p className="mt-3 text-xs leading-5 text-airbnb-gray">
              No crearás otra cuenta ni otro email. Activaremos un perfil musical
              dentro de esta misma cuenta y después podrás completar el wizard.
            </p>
          </div>

          <Button onClick={handleStartFromCurrentAccount} fullWidth loading={loading}>
            Crear perfil musical con mi cuenta
          </Button>

          <Link
            href="/proveedores"
            className="block text-center text-sm font-semibold text-airbnb-dark underline hover:no-underline"
          >
            Seguir explorando como contratante
          </Link>
        </div>
      ) : (
        <>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre completo"
          type="text"
          placeholder="Tu nombre o el de tu banda"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          error={errors.name}
          autoComplete="name"
        />

        <Input
          label="Correo electrónico"
          type="email"
          placeholder="tu@email.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          error={errors.email}
          autoComplete="email"
          hint="Este será tu email de contacto protegido"
        />

        <div className="relative">
          <Input
            label="Contraseña"
            type={showPassword ? "text" : "password"}
            placeholder="Mínimo 8 caracteres"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            error={errors.password}
            autoComplete="new-password"
          />
          <button
            type="button"
            className="absolute right-4 top-[2.35rem] text-airbnb-gray hover:text-airbnb-dark transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <p className="text-xs text-airbnb-gray">
          Al crear tu cuenta aceptas nuestros{" "}
          <Link href="#" className="underline">Términos de servicio</Link>{" "}
          y{" "}
          <Link href="#" className="underline">Política de privacidad</Link>.
        </p>

        <div className="pt-1">
          <Button type="submit" fullWidth loading={loading}>
            Crear cuenta y continuar
          </Button>
        </div>
      </form>

      <div className="divider-text my-6">o</div>

      <p className="text-sm text-airbnb-gray text-center">
        ¿Ya tienes cuenta?{" "}
        <Link
          href="/iniciar-sesion"
          className="font-semibold text-airbnb-dark underline hover:no-underline"
        >
          Iniciar sesión
        </Link>
      </p>
        </>
      )}
    </div>
  );
}
