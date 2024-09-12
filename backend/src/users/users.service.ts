import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DRIZZLE_ORM, PostgresJsDb } from 'src/nest-drizzle';
import { users } from 'src/nest-drizzle/discordSchema';
import * as bcrypt from 'bcrypt';
import { takeUniqueOrThrow } from '@shared/helpers';
import { UpdateUserDto, User } from './dto/users-dto';
@Injectable()
export class UsersService {
  constructor(@Inject(DRIZZLE_ORM) private readonly db: PostgresJsDb) {}

  async findOne(email: string): Promise<User> {
    const { createdAt, updatedAt, ...others } = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .then(takeUniqueOrThrow)
      .catch(() => null);
    return others;
  }

  async createUser(name, password, email) {
    // console.log('triggered createUser');
    const hashedPassword = await bcrypt.hash(password, 13);

    return this.db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
        role: 'user',
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
      });
  }

  async updateUser(email: string, updateDTO: UpdateUserDto) {
    const userQuerySet: Partial<Record<keyof typeof updateDTO, any>> = {};

    const keysToUpdate: (keyof typeof userQuerySet)[] = [
      'name',
      'email',
      'password',
      'image',
      'refreshToken',
      'refreshTokenVersion',
      'role',
    ];
    const updatedDate = new Date();

    // Check if the value is defined in the request, if it is, update the server query
    for (const key of keysToUpdate) {
      const value = updateDTO[key];
      if (value !== undefined) {
        userQuerySet[key] = value;
      }
    }

    const result = await this.db
      .update(users)
      .set({ ...userQuerySet, updatedAt: updatedDate })
      .where(eq(users.email, email))
      .returning();
    // console.log('result ', result);
    return result;
  }
}
