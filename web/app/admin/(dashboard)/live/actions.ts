"use server";

import { revalidatePath } from "next/cache";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { liveHighlights } from "@/db/schema";
import { requireEditor } from "@/lib/session";

function refresh() {
  revalidatePath("/");
  revalidatePath("/admin/live");
}

export async function addLiveHighlight(formData: FormData) {
  await requireEditor();
  const rows = await db.select().from(liveHighlights);
  const maxOrder = rows.reduce((m, r) => Math.max(m, r.sortOrder), -1);
  await db.insert(liveHighlights).values({
    title: String(formData.get("title") || ""),
    subtitle: String(formData.get("subtitle") || ""),
    sortOrder: maxOrder + 1,
  });
  refresh();
}

export async function updateLiveHighlight(id: string, formData: FormData) {
  await requireEditor();
  await db
    .update(liveHighlights)
    .set({
      title: String(formData.get("title") || ""),
      subtitle: String(formData.get("subtitle") || ""),
    })
    .where(eq(liveHighlights.id, id));
  refresh();
}

export async function deleteLiveHighlight(id: string) {
  await requireEditor();
  await db.delete(liveHighlights).where(eq(liveHighlights.id, id));
  refresh();
}

export async function moveLiveHighlight(id: string, direction: -1 | 1) {
  await requireEditor();
  const rows = await db.select().from(liveHighlights).orderBy(asc(liveHighlights.sortOrder));
  const index = rows.findIndex((r) => r.id === id);
  const swapIndex = index + direction;
  if (index === -1 || swapIndex < 0 || swapIndex >= rows.length) return;
  const a = rows[index];
  const b = rows[swapIndex];
  await db.update(liveHighlights).set({ sortOrder: b.sortOrder }).where(eq(liveHighlights.id, a.id));
  await db.update(liveHighlights).set({ sortOrder: a.sortOrder }).where(eq(liveHighlights.id, b.id));
  refresh();
}
