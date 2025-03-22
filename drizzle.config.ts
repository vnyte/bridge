import { env } from '@/env';

export default {
  schema: './src/db/schema/*.ts',
  out: './drizzle/migrations',
  dbCredentials: {
    url: env.POSTGRES_URL,
  },
  dialect: 'postgresql',
  verbose: true,
  strict: true,
};
