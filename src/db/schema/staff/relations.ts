import { relations } from 'drizzle-orm';
import { StaffTable } from './columns';
import { VehicleTable } from '../vehicles/columns';
import { BranchTable } from '../branches/columns';

export const StaffRelations = relations(StaffTable, ({ one }) => ({
  branch: one(BranchTable, {
    fields: [StaffTable.branchId],
    references: [BranchTable.id],
  }),
  assignedVehicle: one(VehicleTable, {
    fields: [StaffTable.assignedVehicleId],
    references: [VehicleTable.id],
  }),
}));
