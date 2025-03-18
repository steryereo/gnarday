CREATE SCHEMA "gnar";
--> statement-breakpoint
CREATE TABLE "gnar"."areas" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "gnar"."areas_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"directions" text,
	"name" text,
	"squallywood_page" integer,
	"zone_id" integer NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gnar"."line_score_modifiers" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "gnar"."line_score_modifiers_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"abbreviation" text,
	"description" text,
	"frequency" text,
	"modifier_type" text,
	"name" text,
	"points" integer,
	"squallywood_page" integer,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gnar"."line_scores" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "gnar"."line_scores_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"line_id" integer NOT NULL,
	"user_id" text NOT NULL,
	"date" date,
	"time" time,
	"notes" text,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gnar"."line_scores_to_line_score_modifiers" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "gnar"."line_scores_to_line_score_modifiers_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"line_score_id" integer NOT NULL,
	"line_score_modifier_id" integer NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gnar"."lines" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "gnar"."lines_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"area_id" integer NOT NULL,
	"difficulty_high" numeric,
	"difficulty_low" numeric,
	"difficulty_medium" numeric,
	"difficulty_text" text,
	"directions" text,
	"name" text,
	"squallywood_page" integer,
	"worth_high" integer,
	"worth_low" integer,
	"worth_medium" integer,
	"zone_id" integer NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gnar"."non_line_related_ecp_scores" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "gnar"."non_line_related_ecp_scores_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" text NOT NULL,
	"non_line_related_ecp_id" integer NOT NULL,
	"date" date,
	"time" time,
	"notes" text,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gnar"."non_line_related_ecps" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "gnar"."non_line_related_ecps_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"abbreviation" text,
	"description" text,
	"frequency" text,
	"name" text,
	"points" integer,
	"squallywood_page" integer,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gnar"."zones" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "gnar"."zones_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"description" text,
	"directions" text,
	"name" text,
	"squallywood_page" integer,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "gnar"."areas" ADD CONSTRAINT "areas_zone_id_zones_id_fk" FOREIGN KEY ("zone_id") REFERENCES "gnar"."zones"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gnar"."line_scores" ADD CONSTRAINT "line_scores_line_id_lines_id_fk" FOREIGN KEY ("line_id") REFERENCES "gnar"."lines"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gnar"."line_scores" ADD CONSTRAINT "line_scores_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "nextauth"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gnar"."line_scores_to_line_score_modifiers" ADD CONSTRAINT "line_scores_to_line_score_modifiers_line_score_id_line_scores_id_fk" FOREIGN KEY ("line_score_id") REFERENCES "gnar"."line_scores"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gnar"."line_scores_to_line_score_modifiers" ADD CONSTRAINT "line_scores_to_line_score_modifiers_line_score_modifier_id_line_score_modifiers_id_fk" FOREIGN KEY ("line_score_modifier_id") REFERENCES "gnar"."line_score_modifiers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gnar"."lines" ADD CONSTRAINT "lines_area_id_areas_id_fk" FOREIGN KEY ("area_id") REFERENCES "gnar"."areas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gnar"."lines" ADD CONSTRAINT "lines_zone_id_zones_id_fk" FOREIGN KEY ("zone_id") REFERENCES "gnar"."zones"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gnar"."non_line_related_ecp_scores" ADD CONSTRAINT "non_line_related_ecp_scores_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "nextauth"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gnar"."non_line_related_ecp_scores" ADD CONSTRAINT "non_line_related_ecp_scores_non_line_related_ecp_id_non_line_related_ecps_id_fk" FOREIGN KEY ("non_line_related_ecp_id") REFERENCES "gnar"."non_line_related_ecps"("id") ON DELETE no action ON UPDATE no action;