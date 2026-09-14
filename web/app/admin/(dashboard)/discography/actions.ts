"use server";

import { revalidatePath } from "next/cache";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { releases } from "@/db/schema";
import { requireEditor } from "@/lib/session";
import { uploadMediaFromForm } from "@/lib/media-actions";
import { parseSpotifyUrl } from "@/lib/spotify";

/** Only ever stores a value that parses as a real Spotify content URL. */
function cleanSpotifyUrl(formData: FormData): string | null {
  const raw = String(formData.get("spotifyUrl") || "").trim();
  if (!raw) return null;
  return parseSpotifyUrl(raw) ? raw : null;
}

function refresh() {
  revalidatePath("/");
  revalidatePath("/admin/discography");
}

export async function addRelease(formData: FormData) {
  await requireEditor();
  const rows = await db.select().from(releases);
  const maxOrder = rows.reduce((m, r) => Math.max(m, r.sortOrder), -1);
  const title = String(formData.get("title") || "");
  const coverImageId = await uploadMediaFromForm(formData, "cover", { alt: title });

  await db.insert(releases).values({
    title,
    subtitle: String(formData.get("subtitle") || ""),
    kind: String(formData.get("kind") || ""),
    note: String(formData.get("note") || ""),
    year: Number(formData.get("year")) || new Date().getFullYear(),
    isLatest: formData.get("isLatest") === "on",
    coverImageId,
    spotifyUrl: cleanSpotifyUrl(formData),
    sortOrder: maxOrder + 1,
  });
  refresh();
}

export async function updateRelease(id: string, formData: FormData) {
  await requireEditor();
  const title = String(formData.get("title") || "");
  const coverImageId = await uploadMediaFromForm(formData, "cover", { alt: title });

  await db
    .update(releases)
    .set({
      title,
      subtitle: String(formData.get("subtitle") || ""),
      kind: String(formData.get("kind") || ""),
      note: String(formData.get("note") || ""),
      year: Number(formData.get("year")) || undefined,
      isLatest: formData.get("isLatest") === "on",
      spotifyUrl: cleanSpotifyUrl(formData),
      ...(coverImageId ? { coverImageId } : {}),
    })
    .where(eq(releases.id, id));
  refresh();
}

export async function deleteRelease(id: string) {
  await requireEditor();
  await db.delete(releases).where(eq(releases.id, id));
  refresh();
}

export async function moveRelease(id: string, direction: -1 | 1) {
  await requireEditor();
  const rows = await db.select().from(releases).orderBy(asc(releases.sortOrder));
  const index = rows.findIndex((r) => r.id === id);
  const swapIndex = index + direction;
  if (index === -1 || swapIndex < 0 || swapIndex >= rows.length) return;
  const a = rows[index];
  const b = rows[swapIndex];
  await db.update(releases).set({ sortOrder: b.sortOrder }).where(eq(releases.id, a.id));
  await db.update(releases).set({ sortOrder: a.sortOrder }).where(eq(releases.id, b.id));
  refresh();
}
