'use server';

import { auth, clerkClient } from '@clerk/nextjs/server';
import { OnboardingFormValues } from '../components/types';
import { onboardingFormSchema } from '../components/types';
import { createTenantWithBranches } from './db';

export async function createTenant(unsafeData: OnboardingFormValues) {
  const { userId } = await auth();
  const { success, data } = onboardingFormSchema.safeParse(unsafeData);

  if (!success) {
    return { error: true, message: 'Invalid data' };
  }

  if (!userId) {
    return { error: true, message: 'User not authenticated' };
  }

  // Keep track of created Clerk resources for potential rollback
  const createdOrgIds: string[] = [];

  try {
    const clerk = await clerkClient();
    const branchesData = [];

    // Create organizations in Clerk
    for (const branch of data.branches) {
      // Create organization in Clerk
      const clerkOrg = await clerk.organizations.createOrganization({
        name: `${data.schoolName} - ${branch.name}`,
        createdBy: userId,
      });

      createdOrgIds.push(clerkOrg.id);

      // Prepare branch data for database transaction
      branchesData.push({
        name: branch.name,
        orgId: clerkOrg.id,
        createdBy: userId,
      });
    }

    const tenantData = {
      name: data.schoolName,
      ownerId: userId,
    };

    // Create all branches in a single transaction with the tenant
    const { tenant, branches } = await createTenantWithBranches(tenantData, branchesData);

    // Update Clerk organizations with the correct tenantId and branchId
    for (const orgId of createdOrgIds) {
      await clerk.organizations.updateOrganization(orgId, {
        publicMetadata: {
          tenantId: tenant.id,
          branchId: branches.find((b) => b.orgId === orgId)?.id,
        },
      });
    }

    // Update user metadata in Clerk
    await clerk.users.updateUserMetadata(userId, {
      publicMetadata: {
        tenantId: tenant.id,
        branches: branches.map((b) => b.id),
        isOnboardingComplete: true,
        isOwner: true,
        defaultOrganizationId: createdOrgIds[0], // Store the default org ID
      },
    });

    console.log('Tenant created successfully. Organizations created:', createdOrgIds);

    return {
      error: false,
      message: 'Tenant created successfully',
      organizationIds: createdOrgIds,
      primaryOrganizationId: createdOrgIds[0], // Return the primary org ID
    };
  } catch (error) {
    console.error('Error during tenant/branch creation:', error);

    // Rollback Clerk resources if any exist
    await rollbackClerkResources(createdOrgIds, userId);

    // Database operations will be automatically rolled back by the transaction

    return {
      error: true,
      message:
        error instanceof Error
          ? `Failed to create tenant: ${error.message}`
          : 'Failed to create tenant due to an unknown error',
    };
  }
}

// Helper function to rollback Clerk resources
async function rollbackClerkResources(orgIds: string[], userId: string): Promise<void> {
  try {
    const clerk = await clerkClient();

    // Rollback organizations in Clerk
    for (const orgId of orgIds) {
      try {
        await clerk.organizations.deleteOrganization(orgId);
      } catch (e) {
        console.error(`Failed to delete Clerk organization ${orgId}:`, e);
      }
    }

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
    console.error('Error during Clerk rollback:', rollbackError);
  }
}
