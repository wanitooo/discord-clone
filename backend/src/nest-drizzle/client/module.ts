import { Module } from '@nestjs/common';
import { NestDrizzleModule } from '../';
import * as schema from '../schema';
import { NestDrizzleClientController } from './controller';

const conString = 'postgres://admin:admin@localhost:5432/discord-clone-backend';

@Module({
  controllers: [NestDrizzleClientController],
  imports: [
    NestDrizzleModule.forRootAsync({
      useFactory: () => {
        return {
          driver: 'postgres-js',
          url: conString,
          options: { schema },
          migrationOptions: { migrationsFolder: './drizzle' },
        };
      },
    }),
  ],
})
export class NestDrizzleClientModule {}
