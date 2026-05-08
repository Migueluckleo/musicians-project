/**
 * File upload utility
 *
 * LOCAL: saves files to /public/uploads/ (served by Next.js)
 * PRODUCTION: swap STORAGE_PROVIDER=supabase and implement uploadToSupabase()
 */

import fs from "fs";
import path from "path";

const STORAGE_PROVIDER = process.env.STORAGE_PROVIDER ?? "local";
const LOCAL_UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

// Ensure local upload directory exists
if (STORAGE_PROVIDER === "local") {
  fs.mkdirSync(LOCAL_UPLOAD_DIR, { recursive: true });
}

export async function uploadFile(
  buffer: Buffer,
  filename: string,
  folder: string = "images"
): Promise<string> {
  if (STORAGE_PROVIDER === "local") {
    return uploadLocal(buffer, filename, folder);
  }

  // Production: implement Supabase Storage upload here
  // return uploadToSupabase(buffer, filename, folder);
  throw new Error("Storage provider not configured for production.");
}

async function uploadLocal(
  buffer: Buffer,
  filename: string,
  folder: string
): Promise<string> {
  const dir = path.join(LOCAL_UPLOAD_DIR, folder);
  fs.mkdirSync(dir, { recursive: true });

  const safeName = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.\-_]/g, "")}`;
  const filePath = path.join(dir, safeName);

  fs.writeFileSync(filePath, buffer);

  // Return public URL relative to /public
  return `/uploads/${folder}/${safeName}`;
}

export function deleteFile(publicUrl: string): void {
  if (STORAGE_PROVIDER === "local") {
    const filePath = path.join(process.cwd(), "public", publicUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
  // Production: implement Supabase Storage delete here
}
