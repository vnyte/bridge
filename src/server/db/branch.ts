import { db } from '@/db';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';

export const _getCurrentOrganizationBranchId = async (orgId: string) => {
  const branch = await db.query.BranchTable.findFirst({
    where: (table) => eq(table.orgId, orgId),
  });

  return branch?.id || null;
};

export const getCurrentOrganizationBranchId = async () => {
  const { userId, orgId } = await auth();

  if (!userId) {
    return null;
  }

  // If no orgId, try to get the user's default organization
  let activeOrgId = orgId;
  if (!activeOrgId) {
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    activeOrgId = user.publicMetadata?.defaultOrganizationId as string;

    if (!activeOrgId) {
      console.warn('No active organization found for user after onboarding');
      return null;
    }
  }

  // Try to get from Clerk organization metadata
  const clerk = await clerkClient();
  const org = await clerk.organizations.getOrganization({ organizationId: activeOrgId });
  const branchId = org?.publicMetadata?.branchId as string | undefined;

  if (branchId) {
    return branchId;
  }

  // Fallback to database query
  return _getCurrentOrganizationBranchId(activeOrgId);
};

const _getCurrentOrganizationBranch = async (orgId: string) => {
  const branch = await db.query.BranchTable.findFirst({
    where: (table) => eq(table.orgId, orgId),
  });

  return branch || null;
};

export const getCurrentOrganizationBranch = async () => {
  const { userId, orgId } = await auth();

  if (!userId) {
    return null;
  }

  // If no orgId, try to get the user's default organization
  let activeOrgId = orgId;
  if (!activeOrgId) {
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    activeOrgId = user.publicMetadata?.defaultOrganizationId as string;

    if (!activeOrgId) {
      console.warn('No active organization found for user after onboarding');
      return null;
    }
  }

  return _getCurrentOrganizationBranch(activeOrgId);
};

export const getCurrentOrganizationTenantId = async () => {
  const { userId, orgId } = await auth();

  if (!userId) {
    return null;
  }

  // If no orgId, try to get the user's default organization
  let activeOrgId = orgId;
  if (!activeOrgId) {
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    activeOrgId = user.publicMetadata?.defaultOrganizationId as string;

    if (!activeOrgId) {
      console.warn('No active organization found for user after onboarding');
      return null;
    }
  }

  try {
    const clerk = await clerkClient();
    const org = await clerk.organizations.getOrganization({ organizationId: activeOrgId });
    const tenantId = org?.publicMetadata?.tenantId as string | undefined;

    if (tenantId) {
      return tenantId;
    }
  } catch (error) {
    console.warn('Failed to get organization metadata from Clerk:', error);
  }

  const branch = await _getCurrentOrganizationBranch(activeOrgId);

  if (!branch?.tenantId) {
    console.error('No tenant found for organization:', activeOrgId);
    console.error('This usually happens when:');
    console.error('1. The onboarding process did not complete successfully');
    console.error('2. The token has not been refreshed after metadata updates');
    console.error('3. There is a mismatch between Clerk org and database records');
  }

  return branch?.tenantId || null;
};
