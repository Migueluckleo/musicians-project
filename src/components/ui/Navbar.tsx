"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Menu, X, Music2, User, LogOut, LayoutDashboard, Search } from "lucide-react";

export function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-airbnb-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-airbnb-red rounded-lg flex items-center justify-center">
              <Music2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-airbnb-red text-xl tracking-tight hidden sm:block">
              músicos
            </span>
          </Link>

          {/* Center search pill — desktop */}
          <Link
            href="/proveedores"
            className="hidden md:flex items-center gap-3 border border-airbnb-border rounded-full px-4 py-2.5 shadow-sm hover:shadow-card transition-all duration-200 group"
          >
            <span className="text-sm font-medium text-airbnb-dark">Géneros</span>
            <span className="w-px h-4 bg-airbnb-border" />
            <span className="text-sm font-medium text-airbnb-dark">Tipo de evento</span>
            <span className="w-px h-4 bg-airbnb-border" />
            <span className="text-sm text-airbnb-gray">Presupuesto</span>
            <div className="w-8 h-8 bg-airbnb-red rounded-full flex items-center justify-center ml-1 group-hover:bg-airbnb-red-hover transition-colors">
              <Search className="w-3.5 h-3.5 text-white" />
            </div>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {!session ? (
              <>
                {/* Desktop */}
                <Link
                  href="/registrarse/proveedor"
                  className="hidden sm:block text-sm font-medium text-airbnb-dark hover:bg-airbnb-bg-hover px-4 py-2 rounded-full transition-colors whitespace-nowrap"
                >
                  Publica tu perfil
                </Link>
                <div className="hidden sm:flex items-center gap-1 border border-airbnb-border rounded-full px-3 py-2 hover:shadow-card transition-all cursor-pointer"
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  <Menu className="w-4 h-4 text-airbnb-dark" />
                  <div className="w-7 h-7 bg-airbnb-gray rounded-full flex items-center justify-center ml-1">
                    <User className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* Mobile */}
                <button
                  className="sm:hidden p-2 rounded-full hover:bg-airbnb-bg-hover"
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  className="hidden sm:flex items-center gap-2 text-sm font-medium text-airbnb-dark hover:bg-airbnb-bg-hover px-4 py-2 rounded-full transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Mi cuenta
                </Link>
                <div
                  className="flex items-center gap-1 border border-airbnb-border rounded-full px-3 py-2 hover:shadow-card transition-all cursor-pointer"
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  <Menu className="w-4 h-4 text-airbnb-dark hidden sm:block" />
                  <div className="w-7 h-7 bg-airbnb-red rounded-full flex items-center justify-center sm:ml-1">
                    <span className="text-white text-xs font-semibold uppercase">
                      {session.user?.name?.[0] || session.user?.email?.[0] || "U"}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Dropdown menu */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute right-4 sm:right-6 top-[4.5rem] sm:top-[5.5rem] z-50 w-60 bg-white rounded-2xl shadow-modal border border-airbnb-border overflow-hidden">
            {!session ? (
              <>
                <Link
                  href="/iniciar-sesion"
                  className="flex items-center px-5 py-3.5 text-sm font-semibold text-airbnb-dark hover:bg-airbnb-bg-hover transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/registrarse/contratante"
                  className="flex items-center px-5 py-3.5 text-sm text-airbnb-dark hover:bg-airbnb-bg-hover transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Crear cuenta
                </Link>
                <div className="border-t border-airbnb-border my-1" />
                <Link
                  href="/proveedores"
                  className="flex items-center px-5 py-3.5 text-sm text-airbnb-gray hover:bg-airbnb-bg-hover transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Explorar músicos
                </Link>
                <Link
                  href="/registrarse/proveedor"
                  className="flex items-center px-5 py-3.5 text-sm text-airbnb-gray hover:bg-airbnb-bg-hover transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Publica tu perfil
                </Link>
              </>
            ) : (
              <>
                <div className="px-5 py-3.5 border-b border-airbnb-border">
                  <p className="text-xs text-airbnb-gray">Sesión iniciada como</p>
                  <p className="text-sm font-medium text-airbnb-dark truncate">
                    {session.user?.email}
                  </p>
                </div>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 px-5 py-3.5 text-sm text-airbnb-dark hover:bg-airbnb-bg-hover transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <LayoutDashboard className="w-4 h-4 text-airbnb-gray" />
                  Mi cuenta
                </Link>
                <Link
                  href="/proveedores"
                  className="flex items-center gap-3 px-5 py-3.5 text-sm text-airbnb-dark hover:bg-airbnb-bg-hover transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <Search className="w-4 h-4 text-airbnb-gray" />
                  Explorar músicos
                </Link>
                <Link
                  href="/registrarse/proveedor"
                  className="flex items-center gap-3 px-5 py-3.5 text-sm text-airbnb-dark hover:bg-airbnb-bg-hover transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <Music2 className="w-4 h-4 text-airbnb-gray" />
                  Publicar perfil musical
                </Link>
                <div className="border-t border-airbnb-border my-1" />
                <button
                  className="flex items-center gap-3 w-full px-5 py-3.5 text-sm text-airbnb-dark hover:bg-airbnb-bg-hover transition-colors"
                  onClick={() => { signOut({ callbackUrl: "/" }); setMenuOpen(false); }}
                >
                  <LogOut className="w-4 h-4 text-airbnb-gray" />
                  Cerrar sesión
                </button>
              </>
            )}
          </div>
        </>
      )}
    </nav>
  );
}
