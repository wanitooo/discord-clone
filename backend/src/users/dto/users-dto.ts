import { InferModelFromColumns, InferSelectModel } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { users } from 'src/nest-drizzle/discordSchema';
import { z } from 'zod';

export const insertUserSchema = createInsertSchema(users, {
  name: z
    .string()
    .min(3, { message: 'Must be more than 3 characters' })
    .max(128, { message: 'Must be less than 128 characters' }),
  email: z.string().email({
    message: 'Must be a valid email',
  }),
  password: z.string().min(3), // .superRefine(checkPasswordComplexity)
}).required({
  name: true,
  password: true,
  email: true,
});

export type CreateUserDto = z.infer<typeof insertUserSchema>;
export type User = InferSelectModel<typeof users>;
