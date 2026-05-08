import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");
const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const requestedPath = path.join(UPLOAD_ROOT, ...params.path);
  const normalizedPath = path.normalize(requestedPath);

  if (!normalizedPath.startsWith(UPLOAD_ROOT)) {
    return NextResponse.json({ error: "Archivo no válido." }, { status: 400 });
  }

  try {
    const file = await fs.readFile(normalizedPath);
    const contentType =
      MIME_TYPES[path.extname(normalizedPath).toLowerCase()] ||
      "application/octet-stream";

    return new NextResponse(file, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Imagen no encontrada." }, { status: 404 });
  }
}
