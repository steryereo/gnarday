"use server";

import { asc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/src/db";
import { zones } from "@/src/db/schema";

import { z } from "zod";

import { InsertZone, insertZoneSchema } from "../zod-schemas/gnar";

export async function getZones() {
  try {
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
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch zones",
    );
  }
}

export async function getZone(id: number) {
  try {
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
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch zone",
    );
  }
}

type CreateZoneResult =
  | { success: true; data: { insertedId: number } }
  | { success: false; error: string };

export async function createZone(
  data: InsertZone,
): Promise<CreateZoneResult> {
  try {
    const [newZone] = await db
      .insert(zones)
      .values(data)
      .returning({ insertedId: zones.id });

    revalidatePath("/admin/zones");

    return { success: true, data: newZone };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create zone",
    };
  }
}

type UpdateZoneResult =
  | { success: true; data: { updatedId: number } }
  | { success: false; error: string };

export async function updateZone(
  data: InsertZone,
  id: number,
): Promise<UpdateZoneResult> {
  try {
    const [updatedZone] = await db
      .update(zones)
      .set(data)
      .where(eq(zones.id, id))
      .returning({ updatedId: zones.id });

    if (!updatedZone) {
      return { success: false, error: "Zone not found" };
    }

    revalidatePath("/admin/zones");
    revalidatePath(`/admin/zones/${id}`);

    return { success: true, data: updatedZone };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update zone",
    };
  }
}

type DeleteZoneResult =
  | { success: true }
  | { success: false; error: string };

export async function deleteZone(id: number): Promise<DeleteZoneResult> {
  try {
    await db.delete(zones).where(eq(zones.id, id));

    revalidatePath("/admin/zones");

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete zone",
    };
  }
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
      const updateResult = await updateZone(
        validatedData,
        parseInt(zoneId as string),
      );
      if (!updateResult.success) {
        return {
          success: false,
          error: updateResult.error,
        };
      }
    } else {
      const createResult = await createZone(validatedData);
      if (!createResult.success) {
        return {
          success: false,
          error: createResult.error,
        };
      }
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
