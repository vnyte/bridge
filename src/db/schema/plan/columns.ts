import { pgTable, timestamp, uuid, integer, time, text } from 'drizzle-orm/pg-core';

export const PlanTable = pgTable('plans', {
  id: uuid('id').primaryKey().defaultRandom(),
  vehicleId: uuid('vehicle_id').notNull(),
  numberOfSessions: integer('number_of_sessions').notNull(),
  sessionDurationInMinutes: integer('session_duration_in_minutes').notNull(),
  joiningDate: text('joining_date').notNull(), // Store as YYYY-MM-DD string to avoid timezone issues
  joiningTime: time('joining_time').notNull(),

  clientId: uuid('client_id').notNull().unique(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
