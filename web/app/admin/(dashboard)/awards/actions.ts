"use server";

import { revalidatePath } from "next/cache";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { awardStats } from "@/db/schema";
import { requireEditor } from "@/lib/session";

function refresh() {
  revalidatePath("/");
  revalidatePath("/admin/awards");
}

export async function addAwardStat(formData: FormData) {
  await requireEditor();
  const rows = await db.select().from(awardStats);
  const maxOrder = rows.reduce((m, r) => Math.max(m, r.sortOrder), -1);
  await db.insert(awardStats).values({
    label: String(formData.get("label") || ""),
    sortOrder: maxOrder + 1,
  });
  refresh();
}

export async function updateAwardStat(id: string, formData: FormData) {
  await requireEditor();
  await db
    .update(awardStats)
    .set({ label: String(formData.get("label") || "") })
    .where(eq(awardStats.id, id));
  refresh();
}

export async function deleteAwardStat(id: string) {
  await requireEditor();
  await db.delete(awardStats).where(eq(awardStats.id, id));
  refresh();
}

export async function moveAwardStat(id: string, direction: -1 | 1) {
  await requireEditor();
  const rows = await db.select().from(awardStats).orderBy(asc(awardStats.sortOrder));
  const index = rows.findIndex((r) => r.id === id);
  const swapIndex = index + direction;
  if (index === -1 || swapIndex < 0 || swapIndex >= rows.length) return;
  const a = rows[index];
  const b = rows[swapIndex];
  await db.update(awardStats).set({ sortOrder: b.sortOrder }).where(eq(awardStats.id, a.id));
  await db.update(awardStats).set({ sortOrder: a.sortOrder }).where(eq(awardStats.id, b.id));
  refresh();
}
