import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string; songId: string } }
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

  await db.repertoireSong.deleteMany({
    where: { id: params.songId, providerProfileId: params.id },
  });

  return NextResponse.json({ ok: true });
}
