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

  const contactPoints = await db.contactPoint.findMany({
    where: { providerProfileId: params.id },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ contactPoints });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const profile = await getOwnedProfile(params.id);
  if (!profile) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { type, value, label } = (await req.json()) as {
    type?: string;
    value?: string;
    label?: string | null;
  };

  if (type !== "PHONE" || !value?.trim()) {
    return NextResponse.json(
      { error: "Agrega un teléfono válido." },
      { status: 422 }
    );
  }

  const contactPoint = await db.contactPoint.create({
    data: {
      providerProfileId: params.id,
      type: "PHONE",
      value: value.trim(),
      label: label?.trim() || null,
    },
  });

  return NextResponse.json({ contactPoint }, { status: 201 });
}
