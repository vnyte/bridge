export type DocumentStatus = 'Expired' | 'Expiring Soon';

export interface DocumentExpiryItem {
  documentType: 'PUC' | 'Insurance' | 'Registration Document';
  vehicleName: string;
  vehicleNumber: string;
  expiryDate: string;
  status: DocumentStatus;
}
