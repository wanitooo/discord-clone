ALTER TABLE "channels" ALTER COLUMN "mode" SET DEFAULT 'public';--> statement-breakpoint
ALTER TABLE "channels" ADD COLUMN "type" text;