"use server";

import { revalidatePath } from "next/cache";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { topTracks } from "@/db/schema";
import { requireEditor } from "@/lib/session";
import { parseSpotifyUrl } from "@/lib/spotify";

function refresh() {
  revalidatePath("/");
  revalidatePath("/admin/top-tracks");
}

function cleanSpotifyUrl(raw: FormDataEntryValue | null) {
  const value = String(raw || "").trim();
  if (!value) return null;
  // Store the raw link only if it actually parses — never persist a value
  // that couldn't be turned into a real embed.
  return parseSpotifyUrl(value) ? value : null;
}

export async function addTopTrack(formData: FormData) {
  await requireEditor();
  const rows = await db.select().from(topTracks);
  const maxOrder = rows.reduce((m, r) => Math.max(m, r.sortOrder), -1);
  await db.insert(topTracks).values({
    title: String(formData.get("title") || ""),
    spotifyUrl: cleanSpotifyUrl(formData.get("spotifyUrl")),
    sortOrder: maxOrder + 1,
  });
  refresh();
}

export async function updateTopTrack(id: string, formData: FormData) {
  await requireEditor();
  await db
    .update(topTracks)
    .set({
      title: String(formData.get("title") || ""),
      spotifyUrl: cleanSpotifyUrl(formData.get("spotifyUrl")),
    })
    .where(eq(topTracks.id, id));
  refresh();
}

export async function deleteTopTrack(id: string) {
  await requireEditor();
  await db.delete(topTracks).where(eq(topTracks.id, id));
  refresh();
}

export async function moveTopTrack(id: string, direction: -1 | 1) {
  await requireEditor();
  const rows = await db.select().from(topTracks).orderBy(asc(topTracks.sortOrder));
  const index = rows.findIndex((r) => r.id === id);
  const swapIndex = index + direction;
  if (index === -1 || swapIndex < 0 || swapIndex >= rows.length) return;
  const a = rows[index];
  const b = rows[swapIndex];
  await db.update(topTracks).set({ sortOrder: b.sortOrder }).where(eq(topTracks.id, a.id));
  await db.update(topTracks).set({ sortOrder: a.sortOrder }).where(eq(topTracks.id, b.id));
  refresh();
}
