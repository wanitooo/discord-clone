import { z } from 'zod';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { channels } from 'src/nest-drizzle/discordSchema';
import { date } from 'drizzle-orm/pg-core';

// const insertchannelschema = createInsertSchema(channels, {
//   id: (schema) => schema.id.positive(),
//   email: (schema) => schema.email.email(),
//   role: z.string(),
// });

export const insertChannelSchema = createInsertSchema(channels, {
  name: z
    .string()
    .min(1, { message: 'Must be more than 1 character' })
    .max(64, { message: 'Must be less than 64 characters' }),
  serverId: z.coerce.number({
    required_error: 'Int reference to server id is required.',
  }),
  type: z.enum(['text', 'voice', 'server', 'bot'], {
    invalid_type_error: 'Type can only be  `text`, `voice`, `server`, or `bot`',
  }),
  mode: z.enum(['public', 'private'], {
    invalid_type_error: 'Type can only be `public` or `private`',
  }),
}).required({
  name: true,
  serverId: true,
  type: true,
  mode: true,
});

export const updateChannelSchema = createInsertSchema(channels, {
  name: z.string().optional(),
  updatedAt: z.date().optional(),
});

export type CreateChannelDto = z.infer<typeof insertChannelSchema>;
export type UpdateChannelDto = z.infer<typeof updateChannelSchema>;
