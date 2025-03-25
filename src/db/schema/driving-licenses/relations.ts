import { relations } from 'drizzle-orm';
import { BranchTable } from '../branches/columns';
import { ClientTable } from '../client/columns';
import { DrivingLicenseTable } from './columns';

export const drivingLicenseRelations = relations(DrivingLicenseTable, ({ one }) => ({
  client: one(ClientTable, {
    fields: [DrivingLicenseTable.clientId],
    references: [ClientTable.id],
  }),
  branch: one(BranchTable, {
    fields: [DrivingLicenseTable.branchId],
    references: [BranchTable.id],
  }),
}));
