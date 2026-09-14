"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { aboutContent } from "@/db/schema";
import { requireEditor } from "@/lib/session";

export async function updateAbout(formData: FormData) {
  await requireEditor();

  await db
    .update(aboutContent)
    .set({
      bornOn: String(formData.get("bornOn") || ""),
      basedIn: String(formData.get("basedIn") || ""),
      role: String(formData.get("role") || ""),
      training: String(formData.get("training") || ""),
      paragraph1: String(formData.get("paragraph1") || ""),
      paragraph2: String(formData.get("paragraph2") || ""),
      quoteLabel: String(formData.get("quoteLabel") || ""),
      quote: String(formData.get("quote") || ""),
      updatedAt: new Date(),
    })
    .where(eq(aboutContent.id, "default"));

  revalidatePath("/");
  revalidatePath("/admin/about");
}
