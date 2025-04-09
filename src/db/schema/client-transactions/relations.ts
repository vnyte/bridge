import { relations } from 'drizzle-orm';
import { PaymentTable } from '../payment/columns';
import { ClientTransactionTable } from './columns';

export const clientTransactionRelations = relations(ClientTransactionTable, ({ one }) => ({
  payment: one(PaymentTable, {
    fields: [ClientTransactionTable.paymentId],
    references: [PaymentTable.id],
  }),
}));
