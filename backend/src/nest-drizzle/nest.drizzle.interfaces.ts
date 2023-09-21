import { DrizzleConfig } from 'drizzle-orm';
import { MigrationConfig } from 'drizzle-orm/migrator';
import { MySql2DrizzleConfig } from 'drizzle-orm/mysql2';
import { ModuleMetadata, Type } from '@nestjs/common/interfaces';

/* Interfaces */
export interface NestDrizzleOptions {
  driver:
    | 'postgres-js'
    | 'mysql2'
    | 'supabase'
    | 'neon'
    | 'planetscale'
    | 'sqlite3';
  url: string;
  options?: DrizzleConfig<Record<string, unknown>>;
  mysql2Options?: MySql2DrizzleConfig<Record<string, unknown>>;
  migrationOptions?: MigrationConfig;
}

export interface NestDrizzleOptionsFactory {
  createNestDrizzleOptions(): Promise<NestDrizzleOptions> | NestDrizzleOptions;
}

export interface NestDrizzleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useExisting?: Type<NestDrizzleOptionsFactory>;
  useClass?: Type<NestDrizzleOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<NestDrizzleOptions> | NestDrizzleOptions;
}
