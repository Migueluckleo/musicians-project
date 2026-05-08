import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/genres — master list of music genres
// Used by wizard (US-MUS-007) and search filters (US-CON-004)

export async function GET() {
  try {
    const genres = await db.genre.findMany({
      orderBy: { name: "asc" },
      select: { id: true, slug: true, name: true },
    });

    return NextResponse.json({ genres });
  } catch (error) {
    console.error("[GET /api/genres]", error);
    return NextResponse.json(
      { error: "Error al cargar los géneros." },
      { status: 500 }
    );
  }
}
