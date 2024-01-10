ALTER TABLE "messages" ALTER COLUMN "reaction" SET DATA TYPE text[][];--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "reaction" DROP DEFAULT;