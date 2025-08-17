import { relations } from 'drizzle-orm';
import { BranchTable } from './columns';
import { TenantTable } from '../tenant/columns';

export const branchesRelations = relations(BranchTable, ({ one }) => ({
  school: one(TenantTable, {
    fields: [BranchTable.tenantId],
    references: [TenantTable.id],
  }),
}));
