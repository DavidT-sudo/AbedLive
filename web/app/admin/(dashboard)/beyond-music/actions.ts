"use server";

import { revalidatePath } from "next/cache";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { beyondMusicItems } from "@/db/schema";
import { requireEditor } from "@/lib/session";

function refresh() {
  revalidatePath("/");
  revalidatePath("/admin/beyond-music");
}

export async function addBeyondMusicItem(formData: FormData) {
  await requireEditor();
  const rows = await db.select().from(beyondMusicItems);
  const maxOrder = rows.reduce((m, r) => Math.max(m, r.sortOrder), -1);
  await db.insert(beyondMusicItems).values({
    kicker: String(formData.get("kicker") || ""),
    title: String(formData.get("title") || ""),
    body: String(formData.get("body") || ""),
    sortOrder: maxOrder + 1,
  });
  refresh();
}

export async function updateBeyondMusicItem(id: string, formData: FormData) {
  await requireEditor();
  await db
    .update(beyondMusicItems)
    .set({
      kicker: String(formData.get("kicker") || ""),
      title: String(formData.get("title") || ""),
      body: String(formData.get("body") || ""),
    })
    .where(eq(beyondMusicItems.id, id));
  refresh();
}

export async function deleteBeyondMusicItem(id: string) {
  await requireEditor();
  await db.delete(beyondMusicItems).where(eq(beyondMusicItems.id, id));
  refresh();
}

export async function moveBeyondMusicItem(id: string, direction: -1 | 1) {
  await requireEditor();
  const rows = await db.select().from(beyondMusicItems).orderBy(asc(beyondMusicItems.sortOrder));
  const index = rows.findIndex((r) => r.id === id);
  const swapIndex = index + direction;
  if (index === -1 || swapIndex < 0 || swapIndex >= rows.length) return;
  const a = rows[index];
  const b = rows[swapIndex];
  await db.update(beyondMusicItems).set({ sortOrder: b.sortOrder }).where(eq(beyondMusicItems.id, a.id));
  await db.update(beyondMusicItems).set({ sortOrder: a.sortOrder }).where(eq(beyondMusicItems.id, b.id));
  refresh();
}
