import { relations } from 'drizzle-orm';
import { ClientTable } from '../client/columns';
import { PaymentTable } from './columns';
import { PlanTable } from '../plan/columns';
import { RTOServicesTable } from '../rto-services/columns';

export const paymentRelations = relations(PaymentTable, ({ one }) => ({
  client: one(ClientTable, {
    fields: [PaymentTable.clientId],
    references: [ClientTable.id],
  }),
  plan: one(PlanTable, {
    fields: [PaymentTable.planId],
    references: [PlanTable.id],
  }),
  rtoService: one(RTOServicesTable, {
    fields: [PaymentTable.rtoServiceId],
    references: [RTOServicesTable.id],
  }),
}));
