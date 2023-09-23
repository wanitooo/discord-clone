ALTER TABLE "channels" ALTER COLUMN "channel_name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "servers" ALTER COLUMN "server_name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "servers" ALTER COLUMN "server_owner" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "channels" ADD COLUMN "channel_uuid" uuid DEFAULT gen_random_uuid();