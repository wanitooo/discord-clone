import { Controller, Get, Inject } from '@nestjs/common';
import { books } from '../schema';
import { DRIZZLE_ORM, PostgresJsDb } from '../../nest-drizzle';

@Controller()
export class NestDrizzleClientController {
  constructor(@Inject(DRIZZLE_ORM) private readonly db: PostgresJsDb) {}

  @Get('/test/db')
  async index() {
    const allUsers = await this.db.select({ name: books.name }).from(books);
    return allUsers;
  }
}
