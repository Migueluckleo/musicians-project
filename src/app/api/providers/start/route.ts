import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "Debes iniciar sesión para crear tu perfil musical." },
      { status: 401 }
    );
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { providerProfile: true },
  });

  if (!user) {
    return NextResponse.json({ error: "Cuenta no encontrada." }, { status: 404 });
  }

  if (user.providerProfile) {
    return NextResponse.json({
      message: "Tu perfil musical ya existe.",
      profile: user.providerProfile,
    });
  }

  const [profile] = await db.$transaction([
    db.providerProfile.create({
      data: {
        userId: user.id,
        stageName: "",
        providerType: "",
        description: "",
        baseLocation: "",
        status: "DRAFT",
        contactPoints: {
          create: {
            type: "EMAIL",
            value: user.email,
            label: "Email de registro",
          },
        },
      },
    }),
    db.user.update({
      where: { id: user.id },
      data: { role: user.role === "BOOKER" ? "BOTH" : user.role },
    }),
  ]);

  return NextResponse.json(
    {
      message: "Perfil musical creado con los datos de tu cuenta.",
      profile,
    },
    { status: 201 }
  );
}
