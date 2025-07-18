import { LicenseClassEnum } from '@/db/schema/enums';
import { pgTable, text, uuid, timestamp } from 'drizzle-orm/pg-core';

export const LearningLicenseTable = pgTable('learning_licenses', {
  id: uuid('id').primaryKey().defaultRandom(),

  class: LicenseClassEnum('class').array(),

  testConductedOn: text('test_conducted_on'), // YYYY-MM-DD string to avoid timezone issues
  licenseNumber: text('license_number'),
  issueDate: text('issue_date'), // YYYY-MM-DD string to avoid timezone issues
  expiryDate: text('expiry_date'), // YYYY-MM-DD string to avoid timezone issues

  // test details
  applicationNumber: text('application_number'),

  clientId: uuid('client_id').notNull().unique(),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
