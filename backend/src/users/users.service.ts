import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DRIZZLE_ORM, PostgresJsDb } from 'src/nest-drizzle';
import { users } from 'src/nest-drizzle/discordSchema';
import * as bcrypt from 'bcrypt';
import { takeUniqueOrThrow } from '@shared/helpers';
@Injectable()
export class UsersService {
  constructor(@Inject(DRIZZLE_ORM) private readonly db: PostgresJsDb) {}

  async findOne(email: string) {
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
}
