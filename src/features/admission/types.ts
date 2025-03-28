import { z } from 'zod';
import { createInsertSchema } from 'drizzle-zod';
import {
  ClientTable,
  BloodGroupEnum,
  GenderEnum,
  CitizenStatusEnum,
} from '@/db/schema/client/columns';
import { LearningLicenseTable } from '@/db/schema/learning-licenses/columns';
import { DrivingLicenseTable } from '@/db/schema/driving-licenses/columns';
import { PlanTable } from '@/db/schema/plan/columns';
import { LicenseTypeEnum } from '@/db/schema/enums';

// Create schemas directly from database tables
export const personalInfoSchema = createInsertSchema(ClientTable, {
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  email: z.string().email('Invalid email address').optional().nullable(),
  branchId: z.string().uuid('Invalid branch ID'),

  birthDate: z.date().min(new Date('1900-01-01'), 'Invalid birth date'),
  bloodGroup: z.enum(BloodGroupEnum.enumValues, {
    required_error: 'Blood group is required',
  }),
  gender: z.enum(GenderEnum.enumValues, {
    required_error: 'Gender is required',
  }),

  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
  pincode: z.string().min(1, 'Pincode is required'),

  citizenStatus: z.enum(CitizenStatusEnum.enumValues, {
    required_error: 'Citizen status is required',
  }),
});

export const learningLicenseSchema = createInsertSchema(LearningLicenseTable, {
  type: z.enum(LicenseTypeEnum.enumValues, {
    required_error: 'License type is required',
  }),
  testConductedOn: z.date().min(new Date('1900-01-01'), 'Invalid test date').optional().nullable(),
  licenseNumber: z.string().optional().nullable(),
  issueDate: z.date().min(new Date('1900-01-01'), 'Invalid issue date').optional().nullable(),
  expiryDate: z.date().min(new Date('1900-01-01'), 'Invalid expiry date').optional().nullable(),
  applicationNumber: z.string().optional().nullable(),
}).omit({ clientId: true, createdAt: true, updatedAt: true });

export const drivingLicenseSchema = createInsertSchema(DrivingLicenseTable, {
  type: z.enum(LicenseTypeEnum.enumValues, {
    required_error: 'License type is required',
  }),
  appointmentDate: z
    .date()
    .min(new Date('1900-01-01'), 'Invalid appointment date')
    .optional()
    .nullable(),
  licenseNumber: z.string().optional().nullable(),
  issueDate: z.date().min(new Date('1900-01-01'), 'Invalid issue date').optional().nullable(),
  expiryDate: z.date().min(new Date('1900-01-01'), 'Invalid expiry date').optional().nullable(),
  applicationNumber: z.string().optional().nullable(),
  testConductedBy: z.string().optional().nullable(),
  imv: z.string().optional().nullable(),
  rto: z.string().optional().nullable(),
  department: z.string().optional().nullable(),
}).omit({ clientId: true, createdAt: true, updatedAt: true });

export const planSchema = createInsertSchema(PlanTable, {
  vehicleId: z.string().uuid('Invalid vehicle ID'),
  numberOfSessions: z.number().min(1, 'Number of sessions is required'),
  sessionDurationInMinutes: z.number().min(1, 'Session duration is required'),
  joiningDate: z.date().min(new Date('1900-01-01'), 'Invalid joining date'),
}).omit({ clientId: true, createdAt: true, updatedAt: true });

// Combined schema for the entire form
export const admissionFormSchema = z.object({
  personalInfo: personalInfoSchema,
  learningLicense: learningLicenseSchema.optional(),
  drivingLicense: drivingLicenseSchema.optional(),
  plan: planSchema,
});

export type PersonalInfoValues = z.infer<typeof personalInfoSchema>;
export type LearningLicenseValues = z.infer<typeof learningLicenseSchema>;
export type DrivingLicenseValues = z.infer<typeof drivingLicenseSchema>;
export type PlanValues = z.infer<typeof planSchema>;
export type AdmissionFormValues = z.infer<typeof admissionFormSchema>;
