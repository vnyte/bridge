import { LicenseClassEnum } from '@/db/schema/enums';
import { date, pgTable, text, uuid, timestamp } from 'drizzle-orm/pg-core';

export const LearningLicenseTable = pgTable('learning_licenses', {
  id: uuid('id').primaryKey().defaultRandom(),

  class: LicenseClassEnum('class').array(),

  testConductedOn: date('test_conducted_on', { mode: 'date' }),
  licenseNumber: text('license_number'),
  issueDate: date('issue_date', { mode: 'date' }),
  expiryDate: date('expiry_date', { mode: 'date' }),

  // test details
  applicationNumber: text('application_number'),

  clientId: uuid('client_id').notNull().unique(),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
