import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

// GET /api/providers — public listing with filters
// US-CON-003, US-CON-004, US-CON-005, US-CON-006, US-CON-007
// BR-020: only published profiles
// NFR-001: contact data never included

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const genre = searchParams.get("genre");         // slug
    const eventType = searchParams.get("event_type") || searchParams.get("event"); // slug
    const query = (searchParams.get("q") || "").trim();
    const priceMin = searchParams.get("price_min");
    const priceMax = searchParams.get("price_max");
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 50);
    const skip = (page - 1) * limit;
    const querySlug = slugifySearch(query);

    const andFilters: Prisma.ProviderProfileWhereInput[] = [{ status: "PUBLISHED" }];

    if (query) {
      andFilters.push({
        OR: [
          { stageName: { contains: query } },
          { providerType: { contains: querySlug || query } },
          { providerTypeOther: { contains: query } },
          { description: { contains: query } },
          { baseLocation: { contains: query } },
          { genres: { some: { genre: { name: { contains: query } } } } },
          { eventTypes: { some: { eventType: { name: { contains: query } } } } },
          ...(querySlug
            ? [
                { genres: { some: { genre: { slug: { contains: querySlug } } } } },
                {
                  eventTypes: {
                    some: { eventType: { slug: { contains: querySlug } } },
                  },
                },
              ]
            : []),
        ],
      });
    }

    if (genre) {
      andFilters.push({
        genres: {
          some: {
            genre: { slug: genre },
          },
        },
      });
    }

    if (eventType) {
      andFilters.push({
        eventTypes: {
          some: {
            eventType: { slug: eventType },
          },
        },
      });
    }

    if (priceMin || priceMax) {
      const priceFilter: { gte?: number; lte?: number } = {};
      if (priceMin) priceFilter.gte = parseFloat(priceMin);
      if (priceMax) priceFilter.lte = parseFloat(priceMax);

      andFilters.push({
        OR: [
          { hourlyPrice: priceFilter },
          { eventPrice: priceFilter },
        ],
      });
    }

    const where: Prisma.ProviderProfileWhereInput = { AND: andFilters };

    const [providers, total] = await Promise.all([
      db.providerProfile.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          stageName: true,
          providerType: true,
          description: true,
          baseLocation: true,
          imageUrl: true,
          minDuration: true,
          maxDuration: true,
          hourlyPrice: true,
          eventPrice: true,
          // NEVER include contactPoints (NFR-001, BR-016)
          genres: {
            select: {
              isPrimary: true,
              genre: { select: { slug: true, name: true } },
            },
          },
          eventTypes: {
            select: {
              eventType: { select: { slug: true, name: true } },
            },
          },
        },
      }),
      db.providerProfile.count({ where }),
    ]);

    return NextResponse.json({
      providers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[GET /api/providers]", error);
    return NextResponse.json(
      { error: "Error al cargar los proveedores." },
      { status: 500 }
    );
  }
}

function slugifySearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
