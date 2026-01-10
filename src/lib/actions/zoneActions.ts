"use server";

import { asc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/src/db";
import { zones } from "@/src/db/schema";

import { InsertZone } from "../zod-schemas/gnar";

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
