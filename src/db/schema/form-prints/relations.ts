import { relations } from 'drizzle-orm';
import { formPrints } from './columns';
import { ClientTable } from '../client/columns';
import { BranchTable } from '../branches/columns';

export const formPrintsRelations = relations(formPrints, ({ one }) => ({
  client: one(ClientTable, {
    fields: [formPrints.clientId],
    references: [ClientTable.id],
  }),
  branch: one(BranchTable, {
    fields: [formPrints.branchId],
    references: [BranchTable.id],
  }),
}));
