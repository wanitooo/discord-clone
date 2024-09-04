import { z } from 'zod';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { servers } from 'src/nest-drizzle/discordSchema';
import { date } from 'drizzle-orm/pg-core';

// const insertServerSchema = createInsertSchema(servers, {
//   id: (schema) => schema.id.positive(),
//   email: (schema) => schema.email.email(),
//   role: z.string(),
// });

export const insertServerSchema = createInsertSchema(servers, {
  name: z
    .string()
    .min(3, { message: 'Must be more than 3 characters' })
    .max(128, { message: 'Must be less than 128 characters' }),
  serverOwner: z.coerce.number({
    required_error: 'Int reference to server owner is required.',
  }),
}).required({
  name: true,
  serverOwner: true,
});

export const updateServerSchema = createInsertSchema(servers, {
  name: z.string().optional(),
  serverOwner: z.number().optional(),
  updatedAt: z.date().optional(),
});

export type SelectServer = typeof servers.$inferSelect;
export type CreateServerDto = z.infer<typeof insertServerSchema>;
export type UpdateServerDto = z.infer<typeof updateServerSchema>;
