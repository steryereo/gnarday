import "server-only";

import { asc, eq } from "drizzle-orm";

import { db } from "@/src/db";
import { zones } from "@/src/db/schema";
import type { InsertZone } from "@/src/lib/zod-schemas/gnar";

import { requireAdmin } from "./auth";

const zoneColumns = {
  id: zones.id,
  name: zones.name,
  description: zones.description,
  directions: zones.directions,
  squallywoodPage: zones.squallywoodPage,
  createdAt: zones.createdAt,
  updatedAt: zones.updatedAt,
};

export async function listZones() {
  await requireAdmin();

  return db.select(zoneColumns).from(zones).orderBy(asc(zones.squallywoodPage));
}

export async function getZone(id: number) {
  await requireAdmin();

  const [zone] = await db
    .select(zoneColumns)
    .from(zones)
    .where(eq(zones.id, id));

  return zone ?? null;
}

export async function createZone(data: InsertZone) {
  await requireAdmin();

  const [created] = await db
    .insert(zones)
    .values(data)
    .returning({ insertedId: zones.id });

  return created;
}

export async function updateZone(id: number, data: InsertZone) {
  await requireAdmin();

  const [updated] = await db
    .update(zones)
    .set(data)
    .where(eq(zones.id, id))
    .returning({ updatedId: zones.id });

  return updated ?? null;
}

export async function deleteZone(id: number) {
  await requireAdmin();

  await db.delete(zones).where(eq(zones.id, id));
}

export type ZoneListItem = Awaited<ReturnType<typeof listZones>>[number];
