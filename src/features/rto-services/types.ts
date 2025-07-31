import type { RTOServicesTable } from '@/db/schema';

export type RTOService = typeof RTOServicesTable.$inferSelect;
export type RTOServiceInsert = typeof RTOServicesTable.$inferInsert;

export type RTOServiceWithClient = RTOService & {
  rtoClient: {
    id: string;
    firstName: string;
    middleName: string | null;
    lastName: string;
    phoneNumber: string;
    aadhaarNumber: string;
  } | null;
};

export type RTOServiceStatus = RTOService['status'];
export type RTOServiceType = RTOService['serviceType'];
export type RTOServicePriority = RTOService['priority'];

export const RTO_SERVICE_TYPE_LABELS: Record<RTOServiceType, string> = {
  LICENSE_RENEWAL: 'License Renewal',
  ADDRESS_CHANGE: 'Address Change',
  DUPLICATE_LICENSE: 'Duplicate License',
  INTERNATIONAL_PERMIT: 'International Permit',
  NEW_LICENSE: 'New License',
  LEARNER_LICENSE: 'Learner License',
  CATEGORY_ADDITION: 'Category Addition',
  LICENSE_TRANSFER: 'License Transfer',
  NAME_CHANGE: 'Name Change',
  ENDORSEMENT_REMOVAL: 'Endorsement Removal',
};

export const RTO_SERVICE_STATUS_LABELS: Record<RTOServiceStatus, string> = {
  PENDING: 'Pending',
  DOCUMENT_COLLECTION: 'Document Collection',
  APPLICATION_SUBMITTED: 'Application Submitted',
  UNDER_REVIEW: 'Under Review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

export const RTO_SERVICE_PRIORITY_LABELS: Record<RTOServicePriority, string> = {
  NORMAL: 'Normal',
  TATKAL: 'Tatkal',
};

// Import from the comprehensive RTO offices database
import { RTO_OFFICES as _RTO_OFFICES } from '@/lib/constants/rto-offices';

export const RTO_OFFICES = _RTO_OFFICES;
export type RTOOffice = (typeof RTO_OFFICES)[number];
