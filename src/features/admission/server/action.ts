'use server';
import { z } from 'zod';
import { DEFAULT_WORKING_DAYS, DEFAULT_OPERATING_HOURS } from '@/lib/constants/business';
import {
  learningLicenseSchema,
  LearningLicenseValues,
  DrivingLicenseValues,
  personalInfoSchema,
  drivingLicenseSchema,
  PlanValues,
  planSchema,
  paymentSchema,
} from '../types';
import { auth } from '@clerk/nextjs/server';
import {
  getCurrentOrganizationBranchId,
  getCurrentOrganizationBranch,
  getCurrentOrganizationTenantId,
} from '@/server/db/branch';
import { ActionReturnType } from '@/types/actions';
import {
  upsertClientInDB,
  upsertLearningLicenseInDB,
  upsertDrivingLicenseInDB,
  getClientById as getClientByIdFromDB,
  upsertPlanInDB,
  upsertPaymentInDB,
} from './db';
import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { PlanTable } from '@/db/schema/plan/columns';
import { VehicleTable } from '@/db/schema/vehicles/columns';
import { calculatePaymentAmounts } from '@/lib/payment/calculate';

export const createClient = async (
  unsafeData: z.infer<typeof personalInfoSchema>
): Promise<{ error: boolean; message: string } & { clientId?: string }> => {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return { error: true, message: 'User not authenticated or not in an organization' };
  }

  const branchId = await getCurrentOrganizationBranchId();
  const tenantId = await getCurrentOrganizationTenantId();

  if (!branchId) {
    return { error: true, message: 'Branch not found' };
  }

  if (!tenantId) {
    return { error: true, message: 'Tenant not found' };
  }

  try {
    const { isExistingClient, clientId } = await upsertClientInDB({
      ...unsafeData,
      branchId,
      tenantId,
    });

    return {
      error: false,
      message: isExistingClient
        ? 'Client information updated successfully'
        : 'Client created successfully',
      clientId,
    };
  } catch (error) {
    console.error('Error creating client:', error);
    return { error: true, message: 'Failed to create client' };
  }
};

export const createLearningLicense = async (data: LearningLicenseValues): ActionReturnType => {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return { error: true, message: 'User not authenticated or not in an organization' };
  }

  const branchId = await getCurrentOrganizationBranchId();

  if (!branchId) {
    return { error: true, message: 'Branch not found' };
  }

  try {
    // Validate the learning license data
    const parseResult = learningLicenseSchema.safeParse(data);

    if (!parseResult.success) {
      return { error: true, message: 'Invalid learning license data' };
    }

    // Create or update the learning license
    const { isExistingLicense } = await upsertLearningLicenseInDB(parseResult.data);

    const action = isExistingLicense ? 'updated' : 'created';
    return {
      error: false,
      message: `Learning license ${action} successfully`,
    };
  } catch (error) {
    console.error('Error processing learning license data:', error);
    return { error: true, message: 'Failed to save learning license information' };
  }
};

export const createDrivingLicense = async (data: DrivingLicenseValues): ActionReturnType => {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return { error: true, message: 'User not authenticated or not in an organization' };
  }

  const branchId = await getCurrentOrganizationBranchId();

  if (!branchId) {
    return { error: true, message: 'Branch not found' };
  }

  try {
    // Validate the driving license data
    const parseResult = drivingLicenseSchema.safeParse(data);

    console.log('parseResult', parseResult.error);

    if (!parseResult.success) {
      return { error: true, message: 'Invalid driving license data' };
    }

    // Create or update the driving license
    const { isExistingLicense } = await upsertDrivingLicenseInDB(parseResult.data);

    const action = isExistingLicense ? 'updated' : 'created';
    return {
      error: false,
      message: `Driving license ${action} successfully`,
    };
  } catch (error) {
    console.error('Error processing driving license data:', error);
    return { error: true, message: 'Failed to save driving license information' };
  }
};

export const getClientById = async (
  clientId: string
): Promise<
  { error: boolean; message: string } & { data?: Awaited<ReturnType<typeof getClientByIdFromDB>> }
> => {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return { error: true, message: 'User not authenticated or not in an organization' };
  }

  if (!clientId) {
    return { error: true, message: 'Client ID is required' };
  }

  try {
    const clientData = await getClientByIdFromDB(clientId);

    if (!clientData) {
      return { error: true, message: 'Client not found' };
    }

    return {
      error: false,
      message: 'Client data retrieved successfully',
      data: clientData,
    };
  } catch (error) {
    console.error('Error fetching client:', error);
    return { error: true, message: 'Failed to fetch client data' };
  }
};

export const createPlan = async (
  data: PlanValues
): Promise<{ error: boolean; message: string } & { planId?: string }> => {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return { error: true, message: 'User not authenticated or not in an organization' };
  }

  const branchId = await getCurrentOrganizationBranchId();

  if (!branchId) {
    return { error: true, message: 'Branch not found' };
  }

  try {
    // Extract time from the joiningDate and format it as a string
    const joiningDateTime = data.joiningDate;
    const hours = joiningDateTime.getHours().toString().padStart(2, '0');
    const minutes = joiningDateTime.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;

    // Validate the plan data
    const parseResult = planSchema.safeParse({ ...data, joiningTime: timeString });

    if (!parseResult.success) {
      return { error: true, message: 'Invalid plan data' };
    }

    // Create or update the plan with separated date and time
    const { isExistingPlan, planId } = await upsertPlanInDB({
      ...parseResult.data,
      joiningTime: timeString,
    });

    const action = isExistingPlan ? 'updated' : 'created';
    return {
      error: false,
      message: `Plan ${action} successfully`,
      planId,
    };
  } catch (error) {
    console.error('Error processing plan data:', error);
    return { error: true, message: 'Failed to save plan information' };
  }
};

export const createPayment = async (
  unsafeData: z.infer<typeof paymentSchema>
): Promise<{ error: boolean; message: string; paymentId?: string }> => {
  const { userId } = await auth();

  if (!userId) {
    return { error: true, message: 'Unauthorized' };
  }

  const branchId = await getCurrentOrganizationBranchId();

  if (!branchId) {
    return { error: true, message: 'Branch not found' };
  }

  if (!unsafeData.planId) {
    return { error: true, message: 'Plan ID is required' };
  }

  try {
    // Get the plan and vehicle data to calculate the original amount
    const plan = await db.query.PlanTable.findFirst({
      where: eq(PlanTable.id, unsafeData.planId),
    });

    if (!plan) {
      return { error: true, message: 'Plan not found' };
    }

    const vehicle = await db.query.VehicleTable.findFirst({
      where: eq(VehicleTable.id, plan.vehicleId),
    });

    if (!vehicle) {
      return { error: true, message: 'Vehicle not found' };
    }

    // Use the utility function to calculate payment amounts
    const { originalAmount, finalAmount, firstInstallmentAmount, secondInstallmentAmount } =
      calculatePaymentAmounts({
        sessions: plan.numberOfSessions,
        duration: plan.sessionDurationInMinutes,
        rate: vehicle.rent,
        discount: unsafeData.discount,
        paymentType: unsafeData.paymentType,
      });

    const { data } = paymentSchema.safeParse({ ...unsafeData, originalAmount, finalAmount });

    // Validate the payment data with our calculated values
    const paymentData = {
      ...data,
      originalAmount,
      finalAmount,
      firstInstallmentAmount,
      secondInstallmentAmount,
      // Convert Date objects to string format for the database
      fullPaymentDate: data?.paymentType === 'FULL_PAYMENT' ? new Date().toISOString() : null,
      firstInstallmentDate: data?.paymentType === 'INSTALLMENTS' ? new Date().toISOString() : null,
      secondInstallmentDate:
        data?.paymentType === 'INSTALLMENTS' && data?.secondInstallmentDate
          ? new Date(data.secondInstallmentDate).toISOString()
          : null,
      paymentDueDate:
        data?.paymentType === 'PAY_LATER' && data?.paymentDueDate
          ? new Date(data.paymentDueDate).toISOString()
          : null,
    };

    const parseResult = paymentSchema.safeParse(paymentData);

    if (!parseResult.success) {
      console.error('Payment validation error:', parseResult.error);
      return { error: true, message: 'Invalid payment data' };
    }

    // Create or update the payment
    const { isExistingPayment, paymentId } = await upsertPaymentInDB(parseResult.data);

    const action = isExistingPayment ? 'updated' : 'created';
    return {
      error: false,
      message: `Payment ${action} successfully`,
      paymentId,
    };
  } catch (error) {
    console.error('Error processing payment data:', error);
    return { error: true, message: 'Failed to save payment information' };
  }
};

export const getBranchConfig = async (): Promise<{
  error: boolean;
  message: string;
  data?: {
    workingDays: number[];
    operatingHours: { start: string; end: string };
  };
}> => {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return { error: true, message: 'User not authenticated or not in an organization' };
  }

  try {
    const branch = await getCurrentOrganizationBranch();

    if (!branch) {
      return { error: true, message: 'Branch not found' };
    }

    return {
      error: false,
      message: 'Branch configuration retrieved successfully',
      data: {
        workingDays: branch.workingDays || DEFAULT_WORKING_DAYS,
        operatingHours: branch.operatingHours || DEFAULT_OPERATING_HOURS,
      },
    };
  } catch (error) {
    console.error('Error fetching branch config:', error);
    return { error: true, message: 'Failed to fetch branch configuration' };
  }
};
