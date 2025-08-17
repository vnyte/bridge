import { text, integer, timestamp, pgTable, uuid } from 'drizzle-orm/pg-core';

export const MessageLogsTable = pgTable('message_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  clientId: text('client_id'),
  messageType: text('message_type'), // 'onboarding' | 'payment'
  status: text('status'), // 'success' | 'failure'
  error: text('error'),
  retryCount: integer('retry_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});
