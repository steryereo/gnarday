"use server";

import { asc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/src/db";
import { zones } from "@/src/db/schema";

import { z } from "zod";

import { InsertZone, insertZoneSchema } from "../zod-schemas/gnar";

export async function getZones() {
  const allZones = await db
    .select({
      id: zones.id,
      name: zones.name,
      description: zones.description,
      directions: zones.directions,
      squallywoodPage: zones.squallywoodPage,
      createdAt: zones.createdAt,
      updatedAt: zones.updatedAt,
    })
    .from(zones)
    .orderBy(asc(zones.squallywoodPage));

  return allZones;
}

export async function getZone(id: number) {
  const [zone] = await db
    .select({
      id: zones.id,
      name: zones.name,
      description: zones.description,
      directions: zones.directions,
      squallywoodPage: zones.squallywoodPage,
      createdAt: zones.createdAt,
      updatedAt: zones.updatedAt,
    })
    .from(zones)
    .where(eq(zones.id, id));

  return zone;
}

export async function createZone(data: InsertZone) {
  const [newZone] = await db
    .insert(zones)
    .values(data)
    .returning({ insertedId: zones.id });

  revalidatePath("/admin/zones");

  return newZone;
}

export async function updateZone(data: InsertZone, id: number) {
  const [updatedZone] = await db
    .update(zones)
    .set(data)
    .where(eq(zones.id, id))
    .returning({ updatedId: zones.id });

  revalidatePath("/admin/zones");
  revalidatePath(`/admin/zones/${id}`);

  return updatedZone;
}

export async function deleteZone(id: number) {
  await db.delete(zones).where(eq(zones.id, id));

  revalidatePath("/admin/zones");
}

type ZoneFormState =
  | { success: true }
  | { success: false; error: string; fieldErrors?: Record<string, string> };

export async function submitZoneForm(
  _previousState: ZoneFormState | null,
  formData: FormData,
): Promise<ZoneFormState> {
  try {
    const zoneId = formData.get("zoneId");
    const squallywoodPageValue = formData.get("squallywoodPage");
    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      directions: formData.get("directions") as string,
      squallywoodPage:
        squallywoodPageValue && squallywoodPageValue !== ""
          ? parseInt(squallywoodPageValue as string)
          : null,
    };

    const validatedData = insertZoneSchema.parse(data);

    if (zoneId) {
      await updateZone(validatedData, parseInt(zoneId as string));
    } else {
      await createZone(validatedData);
    }
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string> = {};
      error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });

      return {
        success: false,
        error: error.errors.map((e) => e.message).join(", "),
        fieldErrors: Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined,
      };
    }
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }
}
