import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/ui/Providers";

export const metadata: Metadata = {
  title: {
    default: "Músicos MX — Encuentra músicos para tu evento",
    template: "%s | Músicos MX",
  },
  description:
    "Encuentra músicos, bandas, mariachis y más para tu evento. Compara opciones, revisa repertorio y contacta con confianza.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="font-sans antialiased bg-white text-airbnb-dark">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
