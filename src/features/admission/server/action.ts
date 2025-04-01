import { z } from 'zod';
import { personalInfoSchema } from '../types';
import { auth } from '@clerk/nextjs/server';
import { getCurrentOrganizationBranchId } from '@/server/db/branch';
import { ActionReturnType } from '@/types/actions';
import { createClientInDB } from './db';

export const createClient = async (
  unsafeData: z.infer<typeof personalInfoSchema>
): ActionReturnType => {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return { error: true, message: 'User not authenticated or not in an organization' };
  }

  const { success, data } = personalInfoSchema.safeParse(unsafeData);

  if (!success) {
    return { error: true, message: 'Invalid client data' };
  }

  const branchId = await getCurrentOrganizationBranchId();

  if (!branchId) {
    return { error: true, message: 'Branch not found' };
  }

  await createClientInDB({
    ...data,
    branchId,
  });

  return { error: false, message: 'Client created successfully' };
};
