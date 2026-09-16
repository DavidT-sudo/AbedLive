"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { media } from "@/db/schema";
import { uploadMedia, deleteMedia } from "@/lib/storage";
import { requireEditor } from "@/lib/session";
import { validateImage, MediaValidationError } from "@/lib/media-validation";

export { MediaValidationError };

/**
 * Uploads a file (from a form's <input type="file">) to SeaweedFS and
 * inserts a `media` row. Returns the new media id, or null if no file was
 * provided (callers treat that as "keep the existing image").
 *
 * Throws `MediaValidationError` (safe to show to the editor as-is) if the
 * file isn't a real, decodable image in an accepted format — callers should
 * catch this and re-render the form with the message rather than letting it
 * bubble up as an unhandled Server Action error.
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
  const { contentType, width, height } = await validateImage(buffer, file.name);

  const { key, url } = await uploadMedia({
    buffer,
    contentType,
    fileName: file.name,
    folder: opts?.folder,
  });

  const [row] = await db
    .insert(media)
    .values({ key, url, alt: opts?.alt ?? "", contentType, width, height })
    .returning();

  return row.id;
}

/**
 * Deletes a previously-uploaded media row and its underlying object.
 * Storage deletion is best-effort — an unreachable bucket shouldn't block
 * clearing the reference, since a stray orphaned object is harmless while a
 * stuck admin form is not.
 */
export async function removeMedia(mediaId: string | null | undefined) {
  await requireEditor();
  if (!mediaId) return;

  const [row] = await db.select().from(media).where(eq(media.id, mediaId));
  if (!row) return;

  await deleteMedia(row.key).catch(() => {});
  await db.delete(media).where(eq(media.id, mediaId));
}
