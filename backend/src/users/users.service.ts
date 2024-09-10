import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DRIZZLE_ORM, PostgresJsDb } from 'src/nest-drizzle';
import { users } from 'src/nest-drizzle/discordSchema';

@Injectable()
export class UsersService {
  constructor(@Inject(DRIZZLE_ORM) private readonly db: PostgresJsDb) {}

  async findOne(email: string) {
    const { createdAt, updatedAt, ...others } = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .then((columns) => columns[0])
      .catch(() => null);
    return others;
  }
}
