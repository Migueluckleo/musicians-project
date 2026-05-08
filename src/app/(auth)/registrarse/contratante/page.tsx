"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Eye, EyeOff, Search, Lock, Heart } from "lucide-react";

const BENEFITS = [
  { icon: <Search className="w-4 h-4" />, text: "Busca y filtra entre cientos de músicos" },
  { icon: <Heart className="w-4 h-4" />, text: "Guarda tus favoritos para comparar" },
  { icon: <Lock className="w-4 h-4" />, text: "Desbloquea contactos desde $1 USD" },
];

export default function BookerRegisterPage() {
  const router = useRouter();

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
          role: "BOOKER",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setApiError(data.error || "Error al crear la cuenta.");
        setLoading(false);
        return;
      }

      // Auto sign in and redirect to providers listing
      const signInResult = await signIn("credentials", {
        email: form.email.trim().toLowerCase(),
        password: form.password,
        redirect: false,
      });

      if (signInResult?.ok) {
        router.push("/proveedores");
        router.refresh();
      } else {
        router.push("/iniciar-sesion");
      }
    } catch {
      setApiError("Error de conexión. Intenta de nuevo.");
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-airbnb-dark">
          Encuentra el músico ideal
        </h1>
        <p className="mt-1 text-sm text-airbnb-gray">
          Crea tu cuenta y explora sin costo
        </p>

        {/* Benefits */}
        <div className="mt-4 space-y-2.5">
          {BENEFITS.map((b, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-airbnb-red-light text-airbnb-red flex items-center justify-center flex-shrink-0">
                {b.icon}
              </div>
              <span className="text-xs text-airbnb-gray">{b.text}</span>
            </div>
          ))}
        </div>
      </div>

      {apiError && (
        <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre completo"
          type="text"
          placeholder="Tu nombre"
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
            Crear cuenta gratuita
          </Button>
        </div>
      </form>

      <div className="divider-text my-6">o</div>

      <div className="space-y-3 text-center">
        <p className="text-sm text-airbnb-gray">
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/iniciar-sesion"
            className="font-semibold text-airbnb-dark underline hover:no-underline"
          >
            Iniciar sesión
          </Link>
        </p>
        <p className="text-sm text-airbnb-gray">
          ¿Eres músico?{" "}
          <Link
            href="/registrarse/proveedor"
            className="font-semibold text-airbnb-red underline hover:no-underline"
          >
            Publica tu perfil
          </Link>
        </p>
      </div>
    </div>
  );
}
