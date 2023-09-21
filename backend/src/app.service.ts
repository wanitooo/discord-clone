import { Inject, Injectable } from '@nestjs/common';
import {
  DRIZZLE_ORM,
  INestDrizzleService,
  NestDrizzleService,
  PostgresJsDb,
} from './nest-drizzle';
import { users } from './nest-drizzle/discordSchema';

@Injectable()
export class AppService {
  constructor(
    @Inject(DRIZZLE_ORM) private readonly db: PostgresJsDb,
    @Inject(NestDrizzleService)
    private readonly drizzleService: INestDrizzleService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  createUser() {
    return this.db
      .insert(users)
      .values({
        name: 'juan',
        password: 'randompoasswesd',
        email: 'juian@email.com',
        role: 'admin',
      })
      .returning({
        insertedId: users.id,
        insertedName: users.name,
        insertedEmail: users.email,
      });
  }

  migrate() {
    return this.drizzleService.migrate();
  }
}
