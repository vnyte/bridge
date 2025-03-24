import { db } from '@/db';
import { BranchTable, TenantTable } from '@/db/schema';

export async function createTenantWithBranches(
  tenantData: typeof TenantTable.$inferInsert,
  branchesData: Array<Omit<typeof BranchTable.$inferInsert, 'tenantId'>>
) {
  // Use a transaction to ensure all database operations succeed or fail together
  return await db.transaction(async (tx) => {
    try {
      // Create tenant
      const [tenant] = await tx.insert(TenantTable).values(tenantData).returning({
        id: TenantTable.id,
        ownerId: TenantTable.ownerId,
      });

      // Create branches with the tenant ID
      const branchesWithTenantId = branchesData.map((branch) => ({
        ...branch,
        tenantId: tenant.id,
      }));

      const branches = await tx.insert(BranchTable).values(branchesWithTenantId).returning({
        id: BranchTable.id,
        createdBy: BranchTable.createdBy,
        tenantId: BranchTable.tenantId,
        orgId: BranchTable.orgId,
      });

      // Return both tenant and branches
      return { tenant, branches };
    } catch (error) {
      // Transaction will automatically roll back if an error occurs
      console.error('Error in transaction:', error);
      throw error;
    }
  });
}
