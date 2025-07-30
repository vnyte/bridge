import { pgTable, text, timestamp, uuid, json, integer } from 'drizzle-orm/pg-core';
import { DEFAULT_WORKING_DAYS, DEFAULT_OPERATING_HOURS } from '@/lib/constants/business';

export const BranchTable = pgTable('branches', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),

  orgId: text('org_id').notNull().unique(),

  // Working days and operating hours configuration
  workingDays: json('working_days').$type<Array<number>>().default(DEFAULT_WORKING_DAYS), // 0=Sunday, 6=Saturday (all days by default)
  operatingHours: json('operating_hours')
    .$type<{ start: string; end: string }>()
    .default(DEFAULT_OPERATING_HOURS),

  // Service charges configuration
  licenseServiceCharge: integer('license_service_charge').default(500), // Charge for handling license process

  tenantId: uuid('tenant_id').notNull(),
  createdBy: text('created_by').notNull(),

  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});
