'use server';

import { auth, clerkClient } from '@clerk/nextjs/server';
import { OnboardingFormValues } from '../components/types';
import { onboardingFormSchema } from '../components/types';
import {
  createBranch as createBranchAsDB,
  createTenant as createTenantInDB,
  deleteBranches as deleteBranchesInDB,
} from './db';
import { db } from '@/db';
import { TenantTable } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function createTenant(
  unsafeData: OnboardingFormValues
): Promise<{ error: boolean; message: string } | undefined> {
  const { userId } = await auth();
  const { success, data } = onboardingFormSchema.safeParse(unsafeData);

  if (!success) {
    return { error: true, message: 'Invalid data' };
  }

  if (!userId) {
    return { error: true, message: 'User not authenticated' };
  }

  // Keep track of created resources for potential rollback
  let tenant: { id: string; ownerId: string } | null = null;
  const createdClerkOrgIds: string[] = [];
  const createdBranchIds: string[] = [];

  try {
    // Create tenant in our database
    tenant = await createTenantInDB({
      name: data.schoolName,
      ownerId: userId,
    });

    const clerk = await clerkClient();

    // Create branches and organizations
    for (const branch of data.branches) {
      // Create organization in Clerk
      const clerkOrg = await clerk.organizations.createOrganization({
        name: branch.name,
        createdBy: userId,
        publicMetadata: {
          tenantId: tenant.id,
        },
      });
      createdClerkOrgIds.push(clerkOrg.id);

      // Create branch in our database
      const createdBranch = await createBranchAsDB({
        name: branch.name,
        clerkOrgId: clerkOrg.id,
        tenantId: tenant.id,
        createdBy: userId,
      });
      createdBranchIds.push(createdBranch.id);
    }

    // Update user metadata in Clerk
    await clerk.users.updateUserMetadata(userId, {
      publicMetadata: {
        tenantId: tenant.id,
        isOnboardingComplete: true,
      },
    });

    return { error: false, message: 'Tenant created successfully' };
  } catch (error) {
    console.error('Error during tenant/branch creation:', error);

    // Rollback everything if any step fails
    await rollbackCreatedResources(tenant?.id, createdBranchIds, createdClerkOrgIds, userId);

    return {
      error: true,
      message:
        error instanceof Error
          ? `Failed to create tenant: ${error.message}`
          : 'Failed to create tenant due to an unknown error',
    };
  }
}

// Helper function to rollback created resources
async function rollbackCreatedResources(
  tenantId: string | undefined,
  branchIds: string[],
  clerkOrgIds: string[],
  userId: string
): Promise<void> {
  try {
    const clerk = await clerkClient();

    // Rollback branches in our database
    if (branchIds.length > 0) {
      await deleteBranchesInDB(branchIds);
    }

    // Rollback organizations in Clerk
    for (const orgId of clerkOrgIds) {
      try {
        await clerk.organizations.deleteOrganization(orgId);
      } catch (e) {
        console.error(`Failed to delete Clerk organization ${orgId}:`, e);
      }
    }

    // Rollback tenant in our database
    if (tenantId) {
      await db.delete(TenantTable).where(eq(TenantTable.id, tenantId));
    }

    // Reset user metadata if needed
    try {
      await clerk.users.updateUserMetadata(userId, {
        publicMetadata: {
          tenantId: null,
          isOnboardingComplete: false,
        },
      });
    } catch (e) {
      console.error(`Failed to reset user metadata for ${userId}:`, e);
    }
  } catch (rollbackError) {
    // Log rollback errors but don't throw - we've already caught the original error
    console.error('Error during rollback:', rollbackError);
  }
}
