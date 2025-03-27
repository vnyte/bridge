import { relations } from 'drizzle-orm';
import { ClientDocumentTable } from './columns';
import { ClientTable } from '../client/columns';

export const clientDocumentRelations = relations(ClientDocumentTable, ({ one }) => ({
  client: one(ClientTable, {
    fields: [ClientDocumentTable.clientId],
    references: [ClientTable.id],
  }),
}));
