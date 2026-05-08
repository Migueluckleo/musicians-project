import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

// US-MUS-001, US-CON (booker registration)
// AC-MUS-001-2, AC-MUS-001-6, AC-MUS-001-3
// BR-001, BR-002

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name, role } = body;

    // Validate required fields
    if (!email || !password || !role) {
      return NextResponse.json(
        { error: "Faltan campos requeridos: email, contraseña y tipo de cuenta." },
        { status: 400 }
      );
    }

    if (!["PROVIDER", "BOOKER"].includes(role)) {
      return NextResponse.json(
        { error: "Tipo de cuenta no válido." },
        { status: 400 }
      );
    }

    // Minimum password length (AC-MUS-001-7)
    if (password.length < 8) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 8 caracteres." },
        { status: 400 }
      );
    }

    // Check for existing email (BR-001, AC-MUS-001-6)
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Ya existe una cuenta con ese email. ¿Quieres iniciar sesión?" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await db.user.create({
      data: {
        email,
        passwordHash,
        name: name ?? null,
        role,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    // If provider: create a draft profile automatically (BR-002)
    if (role === "PROVIDER") {
      await db.providerProfile.create({
        data: {
          userId: user.id,
          stageName: "",
          providerType: "",
          description: "",
          baseLocation: "",
          status: "DRAFT",
          // Seed protected email contact point from registration email
          contactPoints: {
            create: {
              type: "EMAIL",
              value: email,
              label: "Email de registro",
            },
          },
        },
      });
    }

    return NextResponse.json(
      { message: "Cuenta creada exitosamente.", user },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/auth/register]", error);
    return NextResponse.json(
      { error: "Error al crear la cuenta. Intenta de nuevo." },
      { status: 500 }
    );
  }
}
