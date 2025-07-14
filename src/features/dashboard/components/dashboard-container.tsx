import { EmptyState } from './empty-state';
import { PendingPaymentsCard } from './pending-payments-card';
import { DocumentExpiryCard } from './document-expiry-card';
import { getVehicleDocumentExpiry } from '@/server/db/vehicle';

export const DashboardContainer = async () => {
  const pendingPaymentsCount = 16;
  const expiringDocuments = await getVehicleDocumentExpiry();

  return (
    <div className="h-full w-full p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <PendingPaymentsCard pendingCount={pendingPaymentsCount} />
        <DocumentExpiryCard documents={expiringDocuments} />
      </div>

      <div className="flex justify-center items-center h-96">
        <EmptyState />
      </div>
    </div>
  );
};
