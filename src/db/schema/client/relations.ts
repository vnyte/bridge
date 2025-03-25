import { relations } from 'drizzle-orm';
import { ClientTable } from './columns';
import { BranchTable } from '../branches/columns';

export const clientRelations = relations(ClientTable, ({ one }) => ({
  branch: one(BranchTable, {
    fields: [ClientTable.branchId],
    references: [BranchTable.id],
  }),
}));
