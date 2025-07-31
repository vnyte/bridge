import { relations } from 'drizzle-orm';
import { RTOClientTable } from './columns';
import { BranchTable, TenantTable, RTOServicesTable } from '../index';

export const RTOClientRelations = relations(RTOClientTable, ({ one, many }) => ({
  branch: one(BranchTable, {
    fields: [RTOClientTable.branchId],
    references: [BranchTable.id],
  }),
  tenant: one(TenantTable, {
    fields: [RTOClientTable.tenantId],
    references: [TenantTable.id],
  }),
  rtoServices: many(RTOServicesTable),
}));
