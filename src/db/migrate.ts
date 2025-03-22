import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import { env } from '@/env';

const sql = neon(env.POSTGRES_URL);
const db = drizzle(sql);

async function main() {
  try {
    await migrate(db, {
      migrationsFolder: 'drizzle/migrations',
    });
    console.log('Migration complete');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
  process.exit(0);
}

main();
