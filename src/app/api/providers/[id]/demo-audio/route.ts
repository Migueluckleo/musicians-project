import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { uploadFile, deleteFile } from "@/lib/upload";

// POST /api/providers/:id/demo-audio — upload an audio demo file
export async function POST(
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
      select: { id: true, demoAudioUrl: true },
    });

    if (!profile) {
      return NextResponse.json({ error: "Perfil no encontrado." }, { status: 404 });
    }

    const formData = await req.formData();
    const file = formData.get("audio") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No se recibió ningún archivo." }, { status: 400 });
    }

    // Validate MIME type
    const validTypes = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg", "audio/webm", "audio/mp4", "audio/x-m4a"];
    const validExt = /\.(mp3|wav|ogg|webm|m4a)$/i.test(file.name);
    if (!validTypes.includes(file.type) && !validExt) {
      return NextResponse.json(
        { error: "Formato no válido. Solo se aceptan MP3, WAV, OGG o WebM." },
        { status: 400 }
      );
    }

    // 20 MB limit
    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json(
        { error: "El archivo supera el límite de 20 MB." },
        { status: 400 }
      );
    }

    // Delete previous audio if exists
    if (profile.demoAudioUrl) {
      deleteFile(profile.demoAudioUrl);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const demoAudioUrl = await uploadFile(buffer, file.name, "audio");

    await db.providerProfile.update({
      where: { id: params.id },
      data: { demoAudioUrl },
    });

    return NextResponse.json({ demoAudioUrl });
  } catch (error) {
    console.error("[POST /api/providers/:id/demo-audio]", error);
    return NextResponse.json({ error: "Error al subir el audio." }, { status: 500 });
  }
}

// DELETE /api/providers/:id/demo-audio — remove the audio demo
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 });
    }

    const profile = await db.providerProfile.findFirst({
      where: { id: params.id, userId: session.user.id },
      select: { id: true, demoAudioUrl: true },
    });

    if (!profile) {
      return NextResponse.json({ error: "Perfil no encontrado." }, { status: 404 });
    }

    if (profile.demoAudioUrl) {
      deleteFile(profile.demoAudioUrl);
    }

    await db.providerProfile.update({
      where: { id: params.id },
      data: { demoAudioUrl: null },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[DELETE /api/providers/:id/demo-audio]", error);
    return NextResponse.json({ error: "Error al eliminar el audio." }, { status: 500 });
  }
}
