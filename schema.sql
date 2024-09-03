CREATE TABLE IF NOT EXISTS "channels" (
	"id" serial PRIMARY KEY NOT NULL,
	"channel_uuid" uuid DEFAULT gen_random_uuid(),
	"channel_name" text NOT NULL,
	"mode" text DEFAULT 'public',
	"type" text,
	"server_id" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "channels_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"message_uuid" uuid DEFAULT gen_random_uuid(),
	"chat" text DEFAULT '' NOT NULL,
	"edited" boolean DEFAULT false,
	"user_id" integer,
	"channel_id" integer,
	"reaction" text[][],
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "messages_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "servers" (
	"id" serial PRIMARY KEY NOT NULL,
	"server_uuid" uuid DEFAULT gen_random_uuid(),
	"server_name" text NOT NULL,
	"server_image" text DEFAULT 'https://images.unsplash.com/photo-1614680376739-414d95ff43df?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
	"server_owner" integer NOT NULL,
	"mode" text,
	"hidden" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "servers_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_uuid" uuid DEFAULT gen_random_uuid(),
	"name" varchar(256) NOT NULL,
	"email" text,
	"password" text NOT NULL,
	"user_image" text DEFAULT 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1856&q=80',
	"role" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_id_unique" UNIQUE("id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users_to_servers" (
	"user_id" integer NOT NULL,
	"server_id" integer NOT NULL,
	CONSTRAINT users_to_servers_user_id_server_id PRIMARY KEY("user_id","server_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "channels" ADD CONSTRAINT "channels_server_id_servers_id_fk" FOREIGN KEY ("server_id") REFERENCES "servers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "messages" ADD CONSTRAINT "messages_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "messages" ADD CONSTRAINT "messages_channel_id_channels_id_fk" FOREIGN KEY ("channel_id") REFERENCES "channels"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "servers" ADD CONSTRAINT "servers_server_owner_users_id_fk" FOREIGN KEY ("server_owner") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_servers" ADD CONSTRAINT "users_to_servers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_servers" ADD CONSTRAINT "users_to_servers_server_id_servers_id_fk" FOREIGN KEY ("server_id") REFERENCES "servers"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Seed DB
INSERT INTO "users" ("name", "email", "password", "role")
VALUES 
('John Doe', 'john.doe@example.com', 'password123', 'admin'),
('Jane Smith', 'jane.smith@example.com', 'password456', 'user'),
('Alice Johnson', 'alice.johnson@example.com', 'password789', 'moderator');

INSERT INTO "servers" ("server_name", "server_owner", "mode", "hidden")
VALUES 
('Tech Enthusiasts', 1, 'public', 'false'),
('Gaming Hub', 2, 'public', 'false'),
('Private Server', 1, 'private', 'true');

INSERT INTO "channels" ("channel_name", "mode", "type", "server_id")
VALUES 
('general', 'public', 'text', 1),
('random', 'public', 'text', 1),
('gaming', 'public', 'voice', 2),
('announcements', 'public', 'text', 2),
('private-discussions', 'private', 'text', 3);

INSERT INTO "messages" ("chat", "edited", "user_id", "channel_id")
VALUES 
('Hello everyone!', false, 1, 1),
('How are you all doing?', false, 2, 1),
('Anyone up for a game?', false, 3, 3),
('Check out the latest updates!', false, 1, 4),
('This is a private channel', false, 1, 5);

INSERT INTO "users_to_servers" ("user_id", "server_id")
VALUES 
(1, 1),
(1, 2),
(2, 1),
(2, 2),
(3, 2),
(1, 3);
