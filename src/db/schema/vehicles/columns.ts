import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const VehicleTable = pgTable('vehicles', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  number: text('number').notNull(),
  rent: integer('rent').notNull(),

  pucExpiry: text('puc_expiry'), // YYYY-MM-DD string to avoid timezone issues
  insuranceExpiry: text('insurance_expiry'), // YYYY-MM-DD string to avoid timezone issues
  registrationExpiry: text('registration_expiry'), // YYYY-MM-DD string to avoid timezone issues

  branchId: uuid('branch_id').notNull(),

  createdBy: text('created_by').notNull(),

  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});
