import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { detectContactInfo } from "@/lib/contact-detection";

// GET /api/providers/:id — public profile (no contact data)
// BR-020, BR-021, NFR-001

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const profile = await db.providerProfile.findFirst({
      where: { id: params.id, status: "PUBLISHED" },
      select: {
        id: true,
        stageName: true,
        providerType: true,
        providerTypeOther: true,
        description: true,
        baseLocation: true,
        imageUrl: true,
        minDuration: true,
        maxDuration: true,
        hourlyPrice: true,
        eventPrice: true,
        youtubeUrl: true,
        streamingUrl: true,
        demoAudioUrl: true,
        // NEVER include contactPoints here (BR-016, BR-021, NFR-001)
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
        repertoireSongs: {
          select: { id: true, title: true, artist: true },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Proveedor no encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("[GET /api/providers/:id]", error);
    return NextResponse.json(
      { error: "Error al cargar el perfil." },
      { status: 500 }
    );
  }
}

// PATCH /api/providers/:id — update profile (authenticated PROVIDER, own profile)
// BR-007, BR-008, BR-018 — contact detection on public text fields

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 });
    }

    const profile = await db.providerProfile.findFirst({
      where: { id: params.id, userId: session.user.id },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Perfil no encontrado." },
        { status: 404 }
      );
    }

    const body = await req.json();
    const {
      stageName,
      providerType,
      providerTypeOther,
      description,
      baseLocation,
      minDuration,
      maxDuration,
      hourlyPrice,
      eventPrice,
      youtubeUrl,
      streamingUrl,
    } = body;

    // Contact detection on public text fields (BR-007, BR-008, BR-018, BR-019)
    const fieldsToCheck: Record<string, string> = {};
    if (stageName) fieldsToCheck.stageName = stageName;
    if (description) fieldsToCheck.description = description;

    for (const [field, value] of Object.entries(fieldsToCheck)) {
      const detection = detectContactInfo(value);
      if (detection.hasContact) {
        return NextResponse.json(
          {
            error: `El campo "${field === "stageName" ? "nombre artístico" : "descripción"}" contiene información de contacto. Por favor, coloca teléfonos, emails o redes sociales en la sección de puntos de contacto.`,
            detectedIn: field,
            matches: detection.matches,
          },
          { status: 400 }
        );
      }
    }

    // Validate duration logic (BR-013)
    const min = minDuration ?? profile.minDuration;
    const max = maxDuration ?? profile.maxDuration;
    if (min !== null && max !== null && min > max) {
      return NextResponse.json(
        {
          error:
            "La duración mínima no puede ser mayor que la duración máxima.",
        },
        { status: 422 }
      );
    }

    const updated = await db.providerProfile.update({
      where: { id: params.id },
      data: {
        ...(stageName !== undefined && { stageName }),
        ...(providerType !== undefined && { providerType }),
        ...(providerTypeOther !== undefined && { providerTypeOther }),
        ...(description !== undefined && { description }),
        ...(baseLocation !== undefined && { baseLocation }),
        ...(minDuration !== undefined && { minDuration }),
        ...(maxDuration !== undefined && { maxDuration }),
        ...(hourlyPrice !== undefined && { hourlyPrice }),
        ...(eventPrice !== undefined && { eventPrice }),
        ...(youtubeUrl !== undefined && { youtubeUrl }),
        ...(streamingUrl !== undefined && { streamingUrl }),
      },
      select: {
        id: true,
        stageName: true,
        providerType: true,
        description: true,
        baseLocation: true,
        minDuration: true,
        maxDuration: true,
        hourlyPrice: true,
        eventPrice: true,
        youtubeUrl: true,
        streamingUrl: true,
        demoAudioUrl: true,
        status: true,
      },
    });

    return NextResponse.json({ profile: updated });
  } catch (error) {
    console.error("[PATCH /api/providers/:id]", error);
    return NextResponse.json(
      { error: "Error al actualizar el perfil." },
      { status: 500 }
    );
  }
}
