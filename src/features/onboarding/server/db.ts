import { db } from '@/db';
import { BranchTable, TenantTable } from '@/db/schema';
import { CACHE_TAGS, revalidateDbCache } from '@/lib/cache';
import { inArray } from 'drizzle-orm';

export async function createTenant(data: typeof TenantTable.$inferInsert) {
  try {
    const [tenant] = await db.insert(TenantTable).values(data).returning({
      id: TenantTable.id,
      ownerId: TenantTable.ownerId,
    });

    revalidateDbCache({
      tag: CACHE_TAGS.tenants,
      userId: tenant.ownerId,
      tenantId: tenant.id,
    });

    return tenant;
  } catch (error) {
    console.error('Error creating school:', error);
    throw error;
  }
}

export async function createBranch(data: typeof BranchTable.$inferInsert) {
  try {
    const [branch] = await db.insert(BranchTable).values(data).returning({
      id: BranchTable.id,
      createdBy: BranchTable.createdBy,
      tenantId: BranchTable.tenantId,
    });

    revalidateDbCache({
      tag: CACHE_TAGS.tenants,
      userId: branch.createdBy,
      tenantId: branch.tenantId,
    });

    return branch;
  } catch (error) {
    console.error('Error creating branch:', error);
    throw error;
  }
}

export async function deleteTenant(tennatId: string) {
  try {
    const [tenant] = await db.delete(TenantTable).where(eq(TenantTable.id, tennatId)).returning({
      id: TenantTable.id,
      ownerId: TenantTable.ownerId,
    });

    revalidateDbCache({
      tag: CACHE_TAGS.tenants,
      userId: tenant.ownerId,
      tenantId: tenant.id,
    });

    return tenant;
  } catch (error) {
    console.error('Error deleting tenant:', error);
    throw error;
  }
}

export async function deleteBranches(branchIds: string[]) {
  try {
    const deletedBranches = await db
      .delete(BranchTable)
      .where(inArray(BranchTable.id, branchIds))
      .returning({
        id: BranchTable.id,
        tenantId: BranchTable.tenantId,
        createdBy: BranchTable.createdBy,
      });

    deletedBranches.forEach((branch) => {
      revalidateDbCache({
        tag: CACHE_TAGS.tenants,
        userId: branch.createdBy,
        tenantId: branch.tenantId,
      });
    });

    return deletedBranches;
  } catch (error) {
    console.error('Error deleting branches:', error);
    throw error;
  }
}
