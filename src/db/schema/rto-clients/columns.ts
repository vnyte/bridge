import { pgTable, text, timestamp, uuid, boolean, unique } from 'drizzle-orm/pg-core';
import { GenderEnum, BloodGroupEnum } from '../client/columns';

export const RTOClientTable = pgTable(
  'rto_clients',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    firstName: text('first_name').notNull(),
    middleName: text('middle_name'),
    lastName: text('last_name').notNull(),

    aadhaarNumber: text('aadhaar_number').notNull(),
    phoneNumber: text('phone_number').notNull(),
    email: text('email'),

    birthDate: text('birth_date').notNull(), // YYYY-MM-DD string to avoid timezone issues
    gender: GenderEnum().notNull(),

    // Additional personal information
    fatherName: text('father_name'),
    bloodGroup: BloodGroupEnum(),

    // Document information
    passportNumber: text('passport_number'),

    // Emergency contact
    emergencyContact: text('emergency_contact'),
    emergencyContactName: text('emergency_contact_name'),

    // Current address
    address: text('address').notNull(),
    city: text('city').notNull(),
    state: text('state').notNull(),
    pincode: text('pincode').notNull(),

    // Permanent address
    isCurrentAddressSameAsPermanentAddress: boolean(
      'is_current_address_same_as_permanent_address'
    ).default(true),
    permanentAddress: text('permanent_address'),
    permanentCity: text('permanent_city'),
    permanentState: text('permanent_state'),
    permanentPincode: text('permanent_pincode'),

    branchId: uuid('branch_id').notNull(),
    tenantId: uuid('tenant_id').notNull(),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    phoneNumberTenantUnique: unique('rto_client_phone_tenant_unique').on(
      table.phoneNumber,
      table.tenantId
    ),
    aadhaarTenantUnique: unique('rto_client_aadhaar_tenant_unique').on(
      table.aadhaarNumber,
      table.tenantId
    ),
  })
);
