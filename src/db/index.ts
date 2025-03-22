import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import { env } from '@/env';
import * as schema from './schema';

const pool = new Pool({ connectionString: env.POSTGRES_URL });
export const db = drizzle(pool, { schema });
