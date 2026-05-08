import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const profile = await db.providerProfile.findFirst({
    where: { id: params.id, userId: session.user.id },
    include: {
      genres: true,
      eventTypes: true,
      contactPoints: true,
    },
  });

  if (!profile) {
    return NextResponse.json({ error: "Perfil no encontrado." }, { status: 404 });
  }

  const missing: string[] = [];
  if (!profile.stageName.trim()) missing.push("Nombre artístico");
  if (!profile.providerType.trim()) missing.push("Tipo de proveedor");
  if (!profile.description.trim()) missing.push("Descripción");
  if (!profile.baseLocation.trim()) missing.push("Ciudad o región base");
  if (profile.genres.length === 0) missing.push("Al menos un género musical");
  if (profile.eventTypes.length === 0) missing.push("Al menos un tipo de evento");
  if (profile.minDuration === null || profile.maxDuration === null) {
    missing.push("Duración mínima y máxima");
  }
  if (profile.hourlyPrice === null && profile.eventPrice === null) {
    missing.push("Al menos un precio");
  }
  if (profile.contactPoints.length === 0) missing.push("Al menos un punto de contacto");

  if (missing.length > 0) {
    return NextResponse.json(
      {
        error: "Tu perfil todavía necesita información antes de publicarse.",
        missing,
      },
      { status: 422 }
    );
  }

  const published = await db.providerProfile.update({
    where: { id: params.id },
    data: { status: "PUBLISHED" },
    select: { id: true, status: true },
  });

  return NextResponse.json({
    message: "Tu perfil fue publicado correctamente.",
    profile: published,
  });
}
