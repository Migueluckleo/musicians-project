import Link from "next/link";
import { Music2 } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Simple header */}
      <header className="border-b border-airbnb-border px-6 py-4">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <div className="w-8 h-8 bg-airbnb-red rounded-lg flex items-center justify-center">
            <Music2 className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-airbnb-red text-xl tracking-tight">
            músicos
          </span>
        </Link>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-start sm:items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
