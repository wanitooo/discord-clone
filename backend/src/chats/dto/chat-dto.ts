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
}).required({
  userId: true,
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
}).required({
  userId: true,
});
// TODO: Delete chat schema
const UUIDParamsSchema = z.object({
  serverUUID: z.string().uuid({ message: 'serverUUID is required' }),
  channelUUID: z.string().uuid({ message: 'channelUUID is required' }),
});

const createMessageWithUUIDSchema = createMessageSchema.merge(UUIDParamsSchema);
const getMessageWithUUIDSchema = getMessagesSchema.merge(UUIDParamsSchema);

export type CreateMessageDto = z.infer<typeof createMessageWithUUIDSchema>;
export type GetMessagesDto = z.infer<typeof getMessageWithUUIDSchema>;
export type UpdateMessageDto = typeof updateMessageSchema;
