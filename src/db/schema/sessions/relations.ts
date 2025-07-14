import { relations } from 'drizzle-orm';
import { SessionTable } from './columns';
import { ClientTable } from '../client/columns';
import { VehicleTable } from '../vehicles/columns';
import { BranchTable } from '../branches/columns';

export const sessionRelations = relations(SessionTable, ({ one }) => ({
  client: one(ClientTable, {
    fields: [SessionTable.clientId],
    references: [ClientTable.id],
  }),
  vehicle: one(VehicleTable, {
    fields: [SessionTable.vehicleId],
    references: [VehicleTable.id],
  }),
  branch: one(BranchTable, {
    fields: [SessionTable.branchId],
    references: [BranchTable.id],
  }),
  originalSession: one(SessionTable, {
    fields: [SessionTable.originalSessionId],
    references: [SessionTable.id],
  }),
}));
