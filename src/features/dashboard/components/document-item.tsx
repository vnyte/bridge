import { StatusIcon } from './status-icon';
import { DocumentExpiryItem } from '../types';

interface DocumentItemProps {
  document: DocumentExpiryItem;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
};

export const DocumentItem = ({ document }: DocumentItemProps) => {
  return (
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="font-semibold text-sm text-gray-900">{document.documentType}</div>
        <p className="text-gray-600 text-sm mt-1">{document.vehicleName}</p>
        <p className="text-gray-500 text-sm">{document.vehicleNumber}</p>
      </div>

      <div className="text-right flex gap-3">
        <div className="pt-1">
          <StatusIcon status={document.status} />
        </div>
        <div>
          <div className="font-medium text-gray-700">{document.status}</div>
          <div className="text-sm text-gray-500">on {formatDate(document.expiryDate)}</div>
        </div>
      </div>
    </div>
  );
};
