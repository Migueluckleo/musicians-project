import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { parse } from "csv-parse/sync";
import * as XLSX from "xlsx";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

type ParsedSong = {
  row: number;
  title: string;
  artist: string | null;
};

type ParsedError = {
  row: number;
  reason: string;
};

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
  const file = formData.get("file");
  const confirm = formData.get("confirm") === "true";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Selecciona un archivo CSV o Excel." }, { status: 422 });
  }

  const extension = file.name.split(".").pop()?.toLowerCase();
  if (!extension || !["csv", "xlsx", "xls"].includes(extension)) {
    return NextResponse.json(
      { error: "Formato no válido. Usa CSV o Excel." },
      { status: 422 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const rows = parseRows(buffer, extension);
  const { validRows, invalidRows } = validateRows(rows);

  if (confirm && validRows.length > 0) {
    await db.repertoireSong.createMany({
      data: validRows.map((song) => ({
        providerProfileId: params.id,
        title: song.title,
        artist: song.artist,
      })),
    });
  }

  return NextResponse.json({
    validRows,
    invalidRows,
    imported: confirm ? validRows.length : 0,
  });
}

function parseRows(buffer: Buffer, extension: string) {
  if (extension === "csv") {
    const text = buffer.toString("utf-8");
    return parse(text, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as Record<string, string>[];
  }

  const workbook = XLSX.read(buffer, { type: "buffer" });
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json<Record<string, string>>(firstSheet, {
    defval: "",
  });
}

function validateRows(rows: Record<string, string>[]) {
  const validRows: ParsedSong[] = [];
  const invalidRows: ParsedError[] = [];

  rows.forEach((row, index) => {
    const normalized = Object.fromEntries(
      Object.entries(row).map(([key, value]) => [key.toLowerCase().trim(), String(value).trim()])
    );
    const title =
      normalized.title ||
      normalized.titulo ||
      normalized["song title"] ||
      normalized.cancion ||
      normalized.canción;
    const artist =
      normalized.artist ||
      normalized.artista ||
      normalized.reference ||
      normalized.referencia ||
      "";

    if (!title) {
      invalidRows.push({
        row: index + 2,
        reason: "Falta el título de la canción.",
      });
      return;
    }

    validRows.push({
      row: index + 2,
      title,
      artist: artist || null,
    });
  });

  if (rows.length === 0) {
    invalidRows.push({ row: 1, reason: "El archivo está vacío." });
  }

  return { validRows, invalidRows };
}
