import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const BranchTable = pgTable('branches', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),

  clerkOrgId: text('clerk_org_id').notNull().unique(),
  tenantId: uuid('tenant_id').notNull().unique(),

  createdBy: uuid('created_by').notNull(),

  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
});
