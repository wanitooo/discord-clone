import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { messages } from 'src/nest-drizzle/discordSchema';
import { z } from 'zod';

export const createMessageSchema = createInsertSchema(messages, {
  userId: z.number({
    required_error: 'User id is required',
  }),
  chat: z
    .string({
      required_error: 'Chat message is required',
    })
    .min(1, {
      message: 'Chat must not be empty',
    }),
  edited: z.boolean().default(false),
  channelId: z.number({
    required_error: 'Channel id is required',
  }),
}).required({
  userId: true,
  channelId: true,
  chat: true,
});

export const updateMessageSchema = createInsertSchema(messages, {
  userId: z.string(),
  channelId: z.string(),
  chat: z.string(),
});

export const getMessagesSchema = createSelectSchema(messages, {
  userId: z.number({
    required_error: 'User id is required',
  }),
  channelId: z.number({
    required_error: 'Channel id is required',
  }),
}).required({
  userId: true,
  channelId: true,
});
// TODO: Delete chat schema

export type CreateMessageDto = z.infer<typeof createMessageSchema>;
export type GetMessagesDto = z.infer<typeof getMessagesSchema>;
export type UpdateMessageDto = typeof updateMessageSchema;
