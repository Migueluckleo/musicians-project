import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Debes iniciar sesión." }, { status: 401 });
  }

  const { providerId } = (await req.json()) as { providerId?: string };
  if (!providerId) {
    return NextResponse.json(
      { error: "Proveedor requerido para desbloquear contacto." },
      { status: 422 }
    );
  }

  const provider = await db.providerProfile.findFirst({
    where: { id: providerId, status: "PUBLISHED" },
  });
  if (!provider) {
    return NextResponse.json({ error: "Proveedor no encontrado." }, { status: 404 });
  }

  await db.contactUnlock.upsert({
    where: {
      bookerUserId_providerProfileId: {
        bookerUserId: session.user.id,
        providerProfileId: providerId,
      },
    },
    create: {
      bookerUserId: session.user.id,
      providerProfileId: providerId,
      paymentIntentId: `local_stub_${Date.now()}`,
    },
    update: {},
  });

  const contacts = await db.contactPoint.findMany({
    where: { providerProfileId: providerId },
    select: { id: true, type: true, value: true, label: true },
  });

  return NextResponse.json({
    message: "Contacto desbloqueado en modo local.",
    contacts,
  });
}
