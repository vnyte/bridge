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
import { LicenseClassEnum } from '@/db/schema/enums';
import { PaymentModeEnum, PaymentTable, PaymentTypeEnum } from '@/db/schema';

// Create schemas directly from database tables
export const personalInfoSchema = createInsertSchema(ClientTable, {
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  email: z.string().email('Invalid email address').optional().nullable(),

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
  pincode: z.string().min(1, 'Pincode is required'),

  isCurrentAddressSameAsPermanentAddress: z.boolean().default(false),

  permanentAddress: z.string().min(1, 'Permanent address is required'),
  permanentCity: z.string().min(1, 'Permanent city is required'),
  permanentState: z.string().min(1, 'Permanent state is required'),
  permanentPincode: z.string().min(1, 'Permanent pincode is required'),

  citizenStatus: z.enum(CitizenStatusEnum.enumValues, {
    required_error: 'Citizen status is required',
  }),
});

export const learningLicenseSchema = createInsertSchema(LearningLicenseTable, {
  class: z
    .array(z.enum(LicenseClassEnum.enumValues))
    .min(1, 'At least one license class is required'),
  testConductedOn: z.date().min(new Date('1900-01-01'), 'Invalid test date').optional().nullable(),
  licenseNumber: z.string().optional().nullable(),
  issueDate: z.date().min(new Date('1900-01-01'), 'Invalid issue date').optional().nullable(),
  expiryDate: z.date().min(new Date('1900-01-01'), 'Invalid expiry date').optional().nullable(),
  applicationNumber: z.string().optional().nullable(),
});

export const drivingLicenseSchema = createInsertSchema(DrivingLicenseTable, {
  class: z
    .array(z.enum(LicenseClassEnum.enumValues))
    .min(1, 'At least one license class is required'),
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
});

export const planSchema = createInsertSchema(PlanTable, {
  vehicleId: z.string(),
  numberOfSessions: z.number().min(1, 'Number of sessions is required'),
  sessionDurationInMinutes: z.number().min(1, 'Session duration is required'),
  joiningDate: z.date().min(new Date('1900-01-01'), 'Invalid joining date'),
}).omit({ createdAt: true, updatedAt: true });

export const paymentSchema = createInsertSchema(PaymentTable, {
  discount: z.number().default(0),
  paymentType: z
    .enum(PaymentTypeEnum.enumValues, { required_error: 'Payment type is required' })
    .default('FULL_PAYMENT'),
  fullPaymentDate: z.string().nullable().optional(),
  fullPaymentMode: z
    .enum(PaymentModeEnum.enumValues, { required_error: 'Payment mode is required' })
    .default('PAYMENT_LINK'),
  firstInstallmentAmount: z
    .number()
    .min(0, 'First installment amount cannot be negative')
    .default(0)
    .nullable(),
  firstInstallmentDate: z.string().nullable().optional(),
  firstPaymentMode: z
    .enum(PaymentModeEnum.enumValues, { required_error: 'Payment mode is required' })
    .default('PAYMENT_LINK'),
  secondInstallmentAmount: z
    .number()
    .min(0, 'Second installment amount cannot be negative')
    .default(0)
    .nullable(),
  secondInstallmentDate: z.string().nullable().optional(),
  secondPaymentMode: z
    .enum(PaymentModeEnum.enumValues, { required_error: 'Payment mode is required' })
    .default('PAYMENT_LINK'),
  paymentDueDate: z.string().nullable().optional(),
}).omit({ createdAt: true, updatedAt: true });

// Combined schema for the entire form
export const admissionFormSchema = z.object({
  personalInfo: personalInfoSchema,
  learningLicense: learningLicenseSchema.optional(),
  drivingLicense: drivingLicenseSchema.optional(),
  plan: planSchema,
  payment: paymentSchema,
});

export type PersonalInfoValues = z.infer<typeof personalInfoSchema>;
export type LearningLicenseValues = z.infer<typeof learningLicenseSchema>;
export type DrivingLicenseValues = z.infer<typeof drivingLicenseSchema>;
export type LicenseStepValues = LearningLicenseValues | DrivingLicenseValues;
export type PlanValues = z.infer<typeof planSchema>;
export type PaymentValues = z.infer<typeof paymentSchema>;
export type AdmissionFormValues = z.infer<typeof admissionFormSchema>;
