import { relations } from 'drizzle-orm';
import { BranchTable } from '../branches/columns';
import { VehicleTable } from '../vehicles/columns';

export const vehicleRelations = relations(VehicleTable, ({ one }) => ({
  branch: one(BranchTable, {
    fields: [VehicleTable.branchId],
    references: [BranchTable.id],
  }),
}));
