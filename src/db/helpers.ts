import { timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const timestamps = {
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" })
    .defaultNow()
    .notNull()
    .$onUpdate(() => sql`now()`),
};
