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

  const { genres } = (await req.json()) as { genres?: string[] };
  if (!Array.isArray(genres) || genres.length === 0) {
    return NextResponse.json(
      { error: "Selecciona al menos un género musical." },
      { status: 422 }
    );
  }

  const existingGenres = await db.genre.findMany({
    where: { slug: { in: genres } },
    select: { id: true, slug: true },
  });

  if (existingGenres.length !== genres.length) {
    return NextResponse.json(
      { error: "Uno o más géneros seleccionados no son válidos." },
      { status: 422 }
    );
  }

  await db.$transaction([
    db.providerGenre.deleteMany({ where: { providerProfileId: params.id } }),
    db.providerGenre.createMany({
      data: existingGenres.map((genre, index) => ({
        providerProfileId: params.id,
        genreId: genre.id,
        isPrimary: index === 0,
      })),
    }),
  ]);

  return NextResponse.json({ ok: true });
}
