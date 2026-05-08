"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Eye, EyeOff } from "lucide-react";

const ERROR_MESSAGES: Record<string, string> = {
  CredentialsSignin: "Email o contraseña incorrectos.",
  Default: "Ocurrió un error. Intenta de nuevo.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginContent />
    </Suspense>
  );
}

function LoginFallback() {
  return (
    <div className="space-y-5">
      <div>
        <div className="h-8 w-56 rounded-lg bg-airbnb-bg-light" />
        <div className="mt-2 h-4 w-72 rounded-lg bg-airbnb-bg-light" />
      </div>
      <div className="h-12 rounded-xl bg-airbnb-bg-light" />
      <div className="h-12 rounded-xl bg-airbnb-bg-light" />
      <div className="h-12 rounded-xl bg-airbnb-red-light" />
    </div>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: form.email.trim().toLowerCase(),
        password: form.password,
        redirect: false,
      });

      if (result?.error) {
        setError(ERROR_MESSAGES[result.error] ?? ERROR_MESSAGES.Default);
        setLoading(false);
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError(ERROR_MESSAGES.Default);
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-airbnb-dark">Bienvenido de nuevo</h1>
        <p className="mt-1 text-sm text-airbnb-gray">
          Ingresa a tu cuenta para continuar
        </p>
      </div>

      {error && (
        <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Correo electrónico"
          type="email"
          placeholder="tu@email.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          autoComplete="email"
          required
        />

        <div className="relative">
          <Input
            label="Contraseña"
            type={showPassword ? "text" : "password"}
            placeholder="Tu contraseña"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            autoComplete="current-password"
            required
          />
          <button
            type="button"
            className="absolute right-4 top-[2.35rem] text-airbnb-gray hover:text-airbnb-dark transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <div className="pt-1">
          <Button type="submit" fullWidth loading={loading}>
            Iniciar sesión
          </Button>
        </div>
      </form>

      <div className="divider-text my-6">o</div>

      <div className="space-y-4 text-center">
        <p className="text-sm text-airbnb-gray">
          ¿No tienes cuenta?{" "}
          <Link
            href="/registrarse/contratante"
            className="font-semibold text-airbnb-dark underline hover:no-underline"
          >
            Crear cuenta gratuita
          </Link>
        </p>
        <p className="text-sm text-airbnb-gray">
          ¿Eres músico o banda?{" "}
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
