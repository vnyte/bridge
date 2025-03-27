import { LicenseTypeEnum } from '@/db/schema/enums';
import { date, pgTable, text, uuid, timestamp } from 'drizzle-orm/pg-core';

export const DrivingLicenseTable = pgTable('driving_licenses', {
  id: uuid('id').primaryKey().defaultRandom(),

  appointmentDate: date('appointment_date', { mode: 'date' }),
  licenseNumber: text('license_number').notNull(),
  issueDate: date('issue_date', { mode: 'date' }).notNull(),
  expiryDate: date('expiry_date', { mode: 'date' }).notNull(),
  type: LicenseTypeEnum(),

  // test details
  applicationNumber: text('application_number'),
  testConductedBy: text('test_conducted_by'),
  imv: text('imv'),
  rto: text('rto'),
  department: text('department'),

  clientId: uuid('client_id').notNull(),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
