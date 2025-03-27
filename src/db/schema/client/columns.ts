import { pgEnum, pgTable, text, timestamp, uuid, date, boolean } from 'drizzle-orm/pg-core';

export const BloodGroupEnum = pgEnum('blood_group', [
  'A+',
  'B+',
  'AB+',
  'O+',
  'A-',
  'B-',
  'AB-',
  'O-',
]);
export const GenderEnum = pgEnum('gender', ['MALE', 'FEMALE', 'OTHER']);

export const CitizenStatusEnum = pgEnum('citizen_status', [
  'BIRTH',
  'NATURALIZED',
  'CITIZEN',
  'DESCENT',
  'REGISTRATION',
]);

export const ClientTable = pgTable('clients', {
  id: uuid('id').primaryKey().defaultRandom(),
  firstName: text('first_name').notNull(),
  middleName: text('middle_name'),
  lastName: text('last_name').notNull(),

  photoUrl: text('photo_url'),
  signatureUrl: text('signature_url'),

  guardianFirstName: text('guardian_first_name'),
  guardianMiddleName: text('guardian_middle_name'),
  guardianLastName: text('guardian_last_name'),

  birthDate: date('birth_date', { mode: 'date' }).notNull(),
  bloodGroup: BloodGroupEnum().notNull(),
  gender: GenderEnum().notNull(),

  phoneNumber: text('phone_number').notNull(),
  alternativePhoneNumber: text('alternative_phone_number'),
  email: text('email'),

  address: text('address').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  country: text('country').notNull(),
  pincode: text('pincode').notNull(),

  isCurrentAddressSameAsPermanentAddress: boolean(
    'is_current_address_same_as_permanent_address'
  ).default(false),

  permanentAddress: text('permanent_address'),
  permanentCity: text('permanent_city'),
  permanentState: text('permanent_state'),
  permanentCountry: text('permanent_country'),
  permanentPincode: text('permanent_pincode'),

  citizenStatus: CitizenStatusEnum().default('BIRTH'),

  branchId: uuid('branch_id').notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
