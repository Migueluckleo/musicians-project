import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { uploadFile } from "@/lib/upload";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024;

export async function POST(
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

  const formData = await req.formData();
  const file = formData.get("image");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Selecciona una imagen." }, { status: 422 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Formato no válido. Usa JPG, PNG o WEBP." },
      { status: 422 }
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "La imagen no puede pesar más de 5 MB." },
      { status: 422 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const imageUrl = await uploadFile(buffer, file.name, "images");

  const updated = await db.providerProfile.update({
    where: { id: params.id },
    data: { imageUrl },
    select: { id: true, imageUrl: true },
  });

  return NextResponse.json({ profile: updated });
}
