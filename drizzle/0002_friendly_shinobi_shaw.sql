ALTER TABLE "nextauth"."account" SET SCHEMA "public";
--> statement-breakpoint
ALTER TABLE "nextauth"."authenticator" SET SCHEMA "public";
--> statement-breakpoint
ALTER TABLE "nextauth"."session" SET SCHEMA "public";
--> statement-breakpoint
ALTER TABLE "nextauth"."user" SET SCHEMA "public";
--> statement-breakpoint
ALTER TABLE "nextauth"."verificationToken" SET SCHEMA "public";
--> statement-breakpoint
DROP SCHEMA "nextauth";
