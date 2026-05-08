import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

async function getOwnedProfile(profileId: string) {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  return db.providerProfile.findFirst({
    where: { id: profileId, userId: session.user.id },
  });
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const profile = await getOwnedProfile(params.id);
  if (!profile) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const songs = await db.repertoireSong.findMany({
    where: { providerProfileId: params.id },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ songs });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const profile = await getOwnedProfile(params.id);
  if (!profile) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { title, artist } = (await req.json()) as {
    title?: string;
    artist?: string | null;
  };

  if (!title?.trim()) {
    return NextResponse.json(
      { error: "El nombre de la canción es requerido." },
      { status: 422 }
    );
  }

  const song = await db.repertoireSong.create({
    data: {
      providerProfileId: params.id,
      title: title.trim(),
      artist: artist?.trim() || null,
    },
  });

  return NextResponse.json({ song }, { status: 201 });
}
