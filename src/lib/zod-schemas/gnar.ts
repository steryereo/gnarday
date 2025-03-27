import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { areas, lines, zones } from "@/src/db/schema";

export const insertZoneSchema = createInsertSchema(zones);
export type InsertZone = z.infer<typeof insertZoneSchema>;
export const selectZoneSchema = createSelectSchema(zones);
export type SelectZone = z.infer<typeof selectZoneSchema>;

export const insertAreaSchema = createInsertSchema(areas);
export type InsertArea = z.infer<typeof insertAreaSchema>;
export const selectAreaSchema = createSelectSchema(areas);
export type SelectArea = z.infer<typeof selectAreaSchema>;

export const insertLineSchema = createInsertSchema(lines);
export type InsertLine = z.infer<typeof insertLineSchema>;
export const selectLineSchema = createSelectSchema(lines);
export type SelectLine = z.infer<typeof selectLineSchema>;
