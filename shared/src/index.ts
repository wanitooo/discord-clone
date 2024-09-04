import { servers, channels } from "./discordSchema";

export type SelectServers = typeof servers.$inferSelect;
export type SelectChannels = typeof channels.$inferSelect;
