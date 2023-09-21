ALTER TABLE "servers" DROP CONSTRAINT "servers_server_owner_users_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "servers" ADD CONSTRAINT "servers_server_owner_users_id_fk" FOREIGN KEY ("server_owner") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
