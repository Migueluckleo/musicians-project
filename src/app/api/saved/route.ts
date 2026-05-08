import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Debes iniciar sesión." }, { status: 401 });
  }

  const saved = await db.savedProvider.findMany({
    where: { bookerUserId: session.user.id },
    orderBy: { savedAt: "desc" },
    include: {
      providerProfile: {
        include: {
          genres: { include: { genre: true } },
          eventTypes: { include: { eventType: true } },
        },
      },
    },
  });

  return NextResponse.json({ saved });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Debes iniciar sesión." }, { status: 401 });
  }

  const { providerId } = (await req.json()) as { providerId?: string };
  if (!providerId) {
    return NextResponse.json({ error: "Proveedor requerido." }, { status: 422 });
  }

  const saved = await db.savedProvider.upsert({
    where: {
      bookerUserId_providerProfileId: {
        bookerUserId: session.user.id,
        providerProfileId: providerId,
      },
    },
    create: {
      bookerUserId: session.user.id,
      providerProfileId: providerId,
    },
    update: {},
  });

  return NextResponse.json({ saved });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Debes iniciar sesión." }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const providerId = searchParams.get("providerId");
  if (!providerId) {
    return NextResponse.json({ error: "Proveedor requerido." }, { status: 422 });
  }

  await db.savedProvider.deleteMany({
    where: { bookerUserId: session.user.id, providerProfileId: providerId },
  });

  return NextResponse.json({ ok: true });
}
