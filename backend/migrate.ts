import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import * as postgres from 'postgres';

const sql = postgres(
  'postgres://admin:admin@localhost:5432/discord-clone-backend',
  { max: 1 },
);
const db = drizzle(sql);

const main = async () => {
  console.log('Migrating...');
  await migrate(db, { migrationsFolder: 'drizzle' });
  console.log('Done migrating.');
};

try {
  main();
  process.exitCode = 0;
} catch (error) {
  console.log(error);
  process.exitCode = 1;
}
