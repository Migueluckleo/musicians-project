import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const profile = await db.providerProfile.findFirst({
    where: { id: params.id, userId: session.user.id },
  });

  if (!profile) {
    return NextResponse.json({ error: "Perfil no encontrado." }, { status: 404 });
  }

  const { eventTypes } = (await req.json()) as { eventTypes?: string[] };
  if (!Array.isArray(eventTypes) || eventTypes.length === 0) {
    return NextResponse.json(
      { error: "Selecciona al menos un tipo de evento." },
      { status: 422 }
    );
  }

  const existingEventTypes = await db.eventType.findMany({
    where: { slug: { in: eventTypes } },
    select: { id: true },
  });

  if (existingEventTypes.length !== eventTypes.length) {
    return NextResponse.json(
      { error: "Uno o más tipos de evento seleccionados no son válidos." },
      { status: 422 }
    );
  }

  await db.$transaction([
    db.providerEventType.deleteMany({ where: { providerProfileId: params.id } }),
    db.providerEventType.createMany({
      data: existingEventTypes.map((eventType) => ({
        providerProfileId: params.id,
        eventTypeId: eventType.id,
      })),
    }),
  ]);

  return NextResponse.json({ ok: true });
}
