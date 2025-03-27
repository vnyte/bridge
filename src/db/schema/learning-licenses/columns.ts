import { LicenseTypeEnum } from '@/db/schema/enums';
import { date, pgTable, text, uuid, timestamp } from 'drizzle-orm/pg-core';

export const LearningLicenseTable = pgTable('learning_licenses', {
  id: uuid('id').primaryKey().defaultRandom(),

  testConductedOn: date('test_conducted_on', { mode: 'date' }),
  licenseNumber: text('license_number').notNull(),
  issueDate: date('issue_date', { mode: 'date' }).notNull(),
  expiryDate: date('expiry_date', { mode: 'date' }).notNull(),
  applicationNumber: text('application_number'),
  type: LicenseTypeEnum(),

  clientId: uuid('client_id').notNull(),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
