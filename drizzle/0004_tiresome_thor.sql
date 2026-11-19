DROP TABLE "gnar"."areas" CASCADE;--> statement-breakpoint
DROP TABLE "gnar"."line_score_modifiers" CASCADE;--> statement-breakpoint
DROP TABLE "gnar"."line_scores" CASCADE;--> statement-breakpoint
DROP TABLE "gnar"."line_scores_to_line_score_modifiers" CASCADE;--> statement-breakpoint
DROP TABLE "gnar"."lines" CASCADE;--> statement-breakpoint
DROP TABLE "gnar"."non_line_related_ecp_scores" CASCADE;--> statement-breakpoint
DROP TABLE "gnar"."non_line_related_ecps" CASCADE;--> statement-breakpoint
DROP TABLE "gnar"."zones" CASCADE;--> statement-breakpoint
ALTER TABLE "session" DROP COLUMN "impersonated_by";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "role";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "banned";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "ban_reason";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "ban_expires";--> statement-breakpoint
DROP SCHEMA "gnar";
