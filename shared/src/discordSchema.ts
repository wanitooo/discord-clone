import { relations, sql } from "drizzle-orm";
import {
  serial,
  text,
  timestamp,
  pgTable,
  integer,
  varchar,
  uuid,
  primaryKey,
  boolean,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey().unique().primaryKey(),
  uuid: uuid("user_uuid").defaultRandom(),
  name: varchar("name", { length: 256 }).notNull(),
  // username: varchar('username', { length: 256 }),
  email: text("email").unique(),
  password: text("password").notNull(),
  image: text("user_image").default(
    "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1856&q=80"
  ),
  role: text("role").$type<"admin" | "user">(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  refreshToken: varchar("refresh_token").default(""),
  refreshTokenVersion: integer("refresh_token_version").default(0),
});

// TODO: Migrate default db image change
export const servers = pgTable("servers", {
  id: serial("id").unique().primaryKey(),
  uuid: uuid("server_uuid").defaultRandom(),
  name: text("server_name").notNull(),
  image: text("server_image").default(
    "https://wanitooo-discord-clone.s3.ap-southeast-1.amazonaws.com/dc-logo-image.png"
  ),
  serverOwner: integer("server_owner")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
  mode: text("mode"), // Invite only, free for all
  hidden: text("hidden").$type<"hidden" | "seen">(), // Invite only, free for all
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Add messages table, add channel_messages relations
export const channels = pgTable("channels", {
  id: serial("id").unique().primaryKey(),
  uuid: uuid("channel_uuid").defaultRandom(),
  name: text("channel_name").notNull(),
  mode: text("mode").$type<"private" | "public">().default("public"),
  type: text("type").$type<"text" | "voice" | "server" | "bot">(),
  serverId: integer("server_id").references(() => servers.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Reactions can be a table if with custom reactions
export const messages = pgTable("messages", {
  id: serial("id").unique().primaryKey(),
  uuid: uuid("message_uuid").defaultRandom(),
  chat: text("chat").notNull().default(""),
  edited: boolean("edited").default(false),
  userId: integer("user_id").references(() => users.id, {
    onDelete: "cascade",
  }),
  channelId: integer("channel_id").references(() => channels.id, {
    onDelete: "cascade",
  }),
  // Most likely wrong
  reaction: text("reaction").array().array(), // Could just be a UNICODE of all the available reactions
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const usersToServersRelation = relations(users, ({ many }) => ({
  usersToServers: many(usersToServers),
}));

export const usersToServers = pgTable(
  "users_to_servers",
  {
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    serverId: integer("server_id")
      .notNull()
      .references(() => servers.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey(t.userId, t.serverId),
  })
);

export const serversToUsersRelation = relations(servers, ({ many }) => ({
  usersToServers: many(usersToServers),
}));

export const usersToServerRelation = relations(usersToServers, ({ one }) => ({
  server: one(servers, {
    fields: [usersToServers.serverId],
    references: [servers.id],
  }),
  user: one(users, {
    fields: [usersToServers.userId],
    references: [users.id],
  }),
}));

export const channelToServerRelation = relations(channels, ({ one }) => ({
  server: one(servers, {
    fields: [channels.serverId],
    references: [servers.id],
  }),
}));

export const serverOwnerRelation = relations(servers, ({ one }) => ({
  owner: one(users, {
    fields: [servers.serverOwner],
    references: [users.id],
  }),
}));

// export const userMessagesRelation = relations(users, ({ many }) => ({
//   messages: many(messages),
// }));

// export const channelMessagesRelation = relations(channels, ({ many }) => ({
//   messages: many(messages),
// }));

export const messagesUserRelation = relations(messages, ({ one }) => ({
  user: one(users, {
    fields: [messages.userId],
    references: [users.id],
  }),
}));

export const messageToChannelRelation = relations(messages, ({ one }) => ({
  channel: one(channels, {
    fields: [messages.channelId],
    references: [channels.id],
  }),
}));
