import { pgEnum, pgTable, text, timestamp, uuid, integer, boolean } from 'drizzle-orm/pg-core';

export const RTOServiceTypeEnum = pgEnum('rto_service_type', [
  'LICENSE_RENEWAL',
  'ADDRESS_CHANGE',
  'DUPLICATE_LICENSE',
  'INTERNATIONAL_PERMIT',
  'NEW_LICENSE',
  'LEARNER_LICENSE',
  'CATEGORY_ADDITION',
  'LICENSE_TRANSFER',
  'NAME_CHANGE',
  'ENDORSEMENT_REMOVAL',
]);

export const RTOServiceStatusEnum = pgEnum('rto_service_status', [
  'PENDING',
  'DOCUMENT_COLLECTION',
  'APPLICATION_SUBMITTED',
  'UNDER_REVIEW',
  'APPROVED',
  'REJECTED',
  'COMPLETED',
  'CANCELLED',
]);

export const RTOServicePriorityEnum = pgEnum('rto_service_priority', ['NORMAL', 'TATKAL']);

export const RTOServicesTable = pgTable('rto_services', {
  id: uuid('id').primaryKey().defaultRandom(),

  // Client and branch relationship
  rtoClientId: uuid('rto_client_id').notNull(),
  branchId: uuid('branch_id').notNull(),
  tenantId: uuid('tenant_id').notNull(),

  // Service details
  serviceType: RTOServiceTypeEnum().notNull(),
  status: RTOServiceStatusEnum().default('PENDING').notNull(),
  priority: RTOServicePriorityEnum().default('NORMAL').notNull(),

  // Application details
  applicationNumber: text('application_number'),
  rtoOffice: text('rto_office').notNull(),
  existingLicenseNumber: text('existing_license_number'),

  // Fees breakdown
  governmentFees: integer('government_fees').notNull(),
  serviceCharge: integer('service_charge').notNull(),
  urgentFees: integer('urgent_fees').default(0),
  totalAmount: integer('total_amount').notNull(),

  // Dates
  applicationDate: timestamp('application_date').defaultNow().notNull(),
  expectedCompletionDate: timestamp('expected_completion_date'),
  actualCompletionDate: timestamp('actual_completion_date'),

  // Additional details
  remarks: text('remarks'),
  requiredDocuments: text('required_documents'), // JSON string of document list
  submittedDocuments: text('submitted_documents'), // JSON string of submitted docs

  // Tracking
  trackingNumber: text('tracking_number'),
  agentAssigned: text('agent_assigned'),

  // Flags
  isDocumentCollectionComplete: boolean('is_document_collection_complete').default(false),
  isPaymentComplete: boolean('is_payment_complete').default(false),
  requiresClientPresence: boolean('requires_client_presence').default(false),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
