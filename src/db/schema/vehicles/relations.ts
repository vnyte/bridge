import { relations } from 'drizzle-orm';
import { branches } from '../branches/columns';
import { vehicles } from '../vehicles/columns';

export const vehicleRelations = relations(vehicles, ({ one }) => ({
  branch: one(branches, {
    fields: [vehicles.branchId],
    references: [branches.id],
  }),
}));
