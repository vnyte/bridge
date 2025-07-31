import { relations } from 'drizzle-orm';
import { RTOServicesTable } from './columns';
import { RTOClientTable } from '../rto-clients/columns';
import { BranchTable } from '../branches/columns';
import { TenantTable } from '../tenants/columns';
import { PaymentTable } from '../payment/columns';

export const RTOServicesRelations = relations(RTOServicesTable, ({ one, many }) => ({
  rtoClient: one(RTOClientTable, {
    fields: [RTOServicesTable.rtoClientId],
    references: [RTOClientTable.id],
  }),
  branch: one(BranchTable, {
    fields: [RTOServicesTable.branchId],
    references: [BranchTable.id],
  }),
  tenant: one(TenantTable, {
    fields: [RTOServicesTable.tenantId],
    references: [TenantTable.id],
  }),
  payments: many(PaymentTable),
}));
