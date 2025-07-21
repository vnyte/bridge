import { pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const StaffRoleEnum = pgEnum('staff_roles', ['instructor', 'manager', 'accountant']);

export const ClerkRoleEnum = pgEnum('clerk_roles', ['admin', 'member']);

export const StaffTable = pgTable('staff', {
  id: uuid('id').primaryKey().defaultRandom(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  photo: text('photo'), // URL to photo
  staffRole: StaffRoleEnum('staff_role').notNull(),
  clerkRole: ClerkRoleEnum('clerk_role').notNull(),

  // For driving instructors - their default vehicle
  assignedVehicleId: uuid('assigned_vehicle_id'),

  // Instructor-specific fields
  licenseNumber: text('license_number'), // Instructor driving license number
  licenseIssueDate: timestamp('license_issue_date', { mode: 'date' }), // License issue date
  experienceYears: text('experience_years'), // Years of driving instruction experience
  educationLevel: text('education_level'), // Educational qualification

  branchId: uuid('branch_id').notNull(),

  createdBy: text('created_by').notNull(),

  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});
