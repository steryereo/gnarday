CREATE SCHEMA "nextauth";
--> statement-breakpoint
ALTER TABLE "public"."account" SET SCHEMA "nextauth";
--> statement-breakpoint
ALTER TABLE "public"."authenticator" SET SCHEMA "nextauth";
--> statement-breakpoint
ALTER TABLE "public"."session" SET SCHEMA "nextauth";
--> statement-breakpoint
ALTER TABLE "public"."user" SET SCHEMA "nextauth";
--> statement-breakpoint
ALTER TABLE "public"."verificationToken" SET SCHEMA "nextauth";
