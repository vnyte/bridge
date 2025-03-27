import { relations } from 'drizzle-orm';
import { ClientTable } from '../client/columns';
import { DrivingLicenseTable } from './columns';

export const drivingLicenseRelations = relations(DrivingLicenseTable, ({ one }) => ({
  client: one(ClientTable, {
    fields: [DrivingLicenseTable.clientId],
    references: [ClientTable.id],
  }),
}));
