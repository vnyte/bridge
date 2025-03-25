import { relations } from 'drizzle-orm';
import { BranchTable } from '../branches/columns';
import { ClientTable } from '../client/columns';
import { LearningLicenseTable } from './columns';

export const learningLicenseRelations = relations(LearningLicenseTable, ({ one }) => ({
  client: one(ClientTable, {
    fields: [LearningLicenseTable.clientId],
    references: [ClientTable.id],
  }),
  branch: one(BranchTable, {
    fields: [LearningLicenseTable.branchId],
    references: [BranchTable.id],
  }),
}));
