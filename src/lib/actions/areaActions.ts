"use server";

import { asc, eq } from "drizzle-orm";

import { db } from "@/src/db";
import { areas } from "@/src/db/schema";

import { InsertArea } from "../zod-schemas/gnar";

export async function getAreas() {
  const allAreas = await db
    .select()
    .from(areas)
    .orderBy(asc(areas.squallywoodPage));

  return allAreas;
}

export async function getAreasByZone(zoneId: number) {
  const zoneAreas = await db
    .select()
    .from(areas)
    .where(eq(areas.zoneId, zoneId))
    .orderBy(asc(areas.squallywoodPage));

  return zoneAreas;
}

export async function getArea(id: number) {
  const [area] = await db.select().from(areas).where(eq(areas.id, id));

  return area;
}

export async function createArea(data: InsertArea) {
  const [newArea] = await db
    .insert(areas)
    .values(data)
    .returning({ insertedId: areas.id });

  return newArea;
}

export async function updateArea(data: InsertArea, id: number) {
  const [updatedArea] = await db
    .update(areas)
    .set(data)
    .where(eq(areas.id, id))
    .returning({ updatedId: areas.id });

  return updatedArea;
}

export async function deleteArea(id: number) {
  const [deletedArea] = await db
    .delete(areas)
    .where(eq(areas.id, id))
    .returning({ deletedId: areas.id });

  return deletedArea;
}

