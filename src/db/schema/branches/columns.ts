import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const branches = pgTable('branches', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),

  clerkOrgId: text('clerk_org_id').notNull().unique(),
  schoolId: uuid('school_id').notNull().unique(),

  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
});
