import { pgTable, foreignKey, serial, uuid, text, integer, timestamp, unique, varchar, primaryKey } from "drizzle-orm/pg-core"

import { sql } from "drizzle-orm"


export const servers = pgTable("servers", {
	id: serial("id").primaryKey().notNull(),
	serverUuid: uuid("server_uuid").defaultRandom(),
	serverName: text("server_name").notNull(),
	serverOwner: integer("server_owner").notNull().references(() => users.id, { onDelete: "cascade" } ),
	mode: text("mode"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	serverImage: text("server_image").default('https://images.unsplash.com/photo-1679057001914-59ab4131dfff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80'),
	hidden: text("hidden"),
});

export const channels = pgTable("channels", {
	id: serial("id").primaryKey().notNull(),
	channelName: text("channel_name").notNull(),
	mode: text("mode"),
	serverId: integer("server_id").references(() => servers.id),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const users = pgTable("users", {
	id: serial("id").primaryKey().notNull(),
	userUuid: uuid("user_uuid").defaultRandom(),
	name: varchar("name", { length: 256 }).notNull(),
	email: text("email"),
	password: text("password").notNull(),
	role: text("role"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	userImage: text("user_image").default('https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1856&q=80'),
},
(table) => {
	return {
		usersEmailUnique: unique("users_email_unique").on(table.email),
	}
});

export const usersToServers = pgTable("users_to_servers", {
	userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" } ),
	serverId: integer("server_id").notNull().references(() => servers.id, { onDelete: "cascade" } ),
},
(table) => {
	return {
		usersToServersUserIdServerId: primaryKey(table.userId, table.serverId)
	}
});