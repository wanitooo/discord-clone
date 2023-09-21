ALTER TABLE "users_to_servers" DROP CONSTRAINT "users_to_servers_user_id_users_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_servers" ADD CONSTRAINT "users_to_servers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
