import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { INestDrizzleService } from './nest.drizzle.services';

export * from './nest.drizzle.interfaces';
export * from './nest.drizzle.module';
export * from './nest.drizzle.providers';
export * from './nest.drizzle.services';
export * from './nest.drizzle.connection';
export * from './constants';

export type MySql2Db = MySql2Database;
export type SQLite3Db = BetterSQLite3Database;
export type PostgresJsDb = PostgresJsDatabase;
export type drizzleServiceOptions = INestDrizzleService;
