"use server";

import { db } from "@/db";
import { media } from "@/db/schema";
import { uploadMedia } from "@/lib/storage";
import { requireEditor } from "@/lib/session";

/**
 * Uploads a file (from a form's <input type="file">) to SeaweedFS and
 * inserts a `media` row. Returns the new media id, or null if no file was
 * provided (callers treat that as "keep the existing image").
 */
export async function uploadMediaFromForm(
  formData: FormData,
  fieldName: string,
  opts?: { alt?: string; folder?: string }
): Promise<string | null> {
  await requireEditor();

  const file = formData.get(fieldName);
  if (!(file instanceof File) || file.size === 0) return null;

  const buffer = Buffer.from(await file.arrayBuffer());
  const { key, url } = await uploadMedia({
    buffer,
    contentType: file.type || "application/octet-stream",
    fileName: file.name,
    folder: opts?.folder,
  });

  const [row] = await db
    .insert(media)
    .values({ key, url, alt: opts?.alt ?? "" })
    .returning();

  return row.id;
}
