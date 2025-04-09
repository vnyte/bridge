import { pgTable, text, uuid, integer, timestamp, pgEnum, jsonb } from 'drizzle-orm/pg-core';

export const PaymentModeEnum = pgEnum('payment_mode', ['PAYMENT_LINK', 'QR', 'CASH', 'CHEQUE']);

export const ClientTransactionStatusEnum = pgEnum('client_transaction_status', [
  'SUCCESS',
  'PENDING',
  'FAILED',
  'REFUNDED',
  'CANCELLED',
]);

// Table to track individual payment transactions
export const ClientTransactionTable = pgTable('client_transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  paymentId: uuid('payment_id').notNull(),
  amount: integer('amount').notNull(),
  paymentMode: PaymentModeEnum('payment_mode').notNull(),
  transactionReference: text('transaction_reference'),
  transactionStatus: ClientTransactionStatusEnum('transaction_status').notNull().default('PENDING'),
  notes: text('notes'),
  metadata: jsonb('metadata'), // Store any additional gateway-specific data

  // For installment payments
  installmentNumber: integer('installment_number'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
});
