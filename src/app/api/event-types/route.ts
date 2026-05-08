import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/event-types — master list of event types
// Used by wizard (US-MUS-006) and search filters (US-CON-005)

export async function GET() {
  try {
    const eventTypes = await db.eventType.findMany({
      orderBy: { name: "asc" },
      select: { id: true, slug: true, name: true },
    });

    return NextResponse.json({ eventTypes });
  } catch (error) {
    console.error("[GET /api/event-types]", error);
    return NextResponse.json(
      { error: "Error al cargar los tipos de evento." },
      { status: 500 }
    );
  }
}
