import { relations } from 'drizzle-orm';
import { VehicleTable } from '../vehicles/columns';
import { VehicleDocumentTable } from './columns';

export const vehicleDocumentsRelations = relations(VehicleDocumentTable, ({ one }) => ({
  vehicle: one(VehicleTable, {
    fields: [VehicleDocumentTable.vehicleId],
    references: [VehicleTable.id],
  }),
}));
