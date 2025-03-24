import { date, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const VehicleTable = pgTable('vehicles', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  number: text('number').notNull(),
  rent: integer('rent').notNull(),

  pucExpiry: date('puc_expiry'),
  insuranceExpiry: date('insurance_expiry'),
  registrationExpiry: date('registration_expiry'),

  branchId: uuid('branch_id').notNull(),
  orgId: text('org_id').notNull(),

  createdBy: text('created_by').notNull(),

  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
});
