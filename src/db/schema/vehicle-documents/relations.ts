import { relations } from 'drizzle-orm';
import { vehicles } from '../vehicles/columns';
import { vehicleDocuments } from './columns';

export const vehicleDocumentsRelations = relations(vehicleDocuments, ({ one }) => ({
  vehicle: one(vehicles, {
    fields: [vehicleDocuments.vehicleId],
    references: [vehicles.id],
  }),
}));
