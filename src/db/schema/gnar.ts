import {
  pgSchema,
  text,
  integer,
  numeric,
  date,
  time,
} from "drizzle-orm/pg-core";

import { timestamps } from "../helpers";
import { user } from "./auth";

export const gnarSchema = pgSchema("gnar");

export const zones = gnarSchema.table("zones", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  description: text("description"),
  directions: text("directions"),
  name: text("name"),
  squallywoodPage: integer("squallywood_page"),
  ...timestamps,
});

export const areas = gnarSchema.table("areas", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  directions: text("directions"),
  name: text("name"),
  squallywoodPage: integer("squallywood_page"),
  zoneId: integer("zone_id")
    .notNull()
    .references(() => zones.id),
  ...timestamps,
});

export const lines = gnarSchema.table("lines", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  areaId: integer("area_id")
    .references(() => areas.id),
  difficultyHigh: numeric("difficulty_high"),
  difficultyLow: numeric("difficulty_low"),
  difficultyMedium: numeric("difficulty_medium"),
  difficultyText: text("difficulty_text"),
  directions: text("directions"),
  name: text("name"),
  squallywoodPage: integer("squallywood_page"),
  worthHigh: integer("worth_high"),
  worthLow: integer("worth_low"),
  worthMedium: integer("worth_medium"),
  zoneId: integer("zone_id")
    .notNull()
    .references(() => zones.id),
  ...timestamps,
});

export const lineScoreModifiers = gnarSchema.table("line_score_modifiers", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  abbreviation: text("abbreviation"),
  description: text("description"),
  frequency: text("frequency"),
  modifierType: text("modifier_type"),
  name: text("name"),
  points: integer("points"),
  squallywoodPage: integer("squallywood_page"),
  ...timestamps,
});

export const nonLineRelatedEcps = gnarSchema.table("non_line_related_ecps", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  abbreviation: text("abbreviation"),
  description: text("description"),
  frequency: text("frequency"),
  name: text("name"),
  points: integer("points"),
  squallywoodPage: integer("squallywood_page"),
  ...timestamps,
});

export const lineScores = gnarSchema.table("line_scores", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  lineId: integer("line_id")
    .notNull()
    .references(() => lines.id),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  date: date("date"),
  time: time("time"),
  notes: text("notes"),
  ...timestamps,
});

export const nonLineRelatedEcpScores = gnarSchema.table(
  "non_line_related_ecp_scores",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id),
    nonLineRelatedEcpId: integer("non_line_related_ecp_id")
      .notNull()
      .references(() => nonLineRelatedEcps.id),
    date: date("date"),
    time: time("time"),
    notes: text("notes"),
    ...timestamps,
  }
);

export const lineScoresToLineScoreModifiers = gnarSchema.table(
  "line_scores_to_line_score_modifiers",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    lineScoreId: integer("line_score_id")
      .notNull()
      .references(() => lineScores.id),
    lineScoreModifierId: integer("line_score_modifier_id")
      .notNull()
      .references(() => lineScoreModifiers.id),
    ...timestamps,
  }
);
