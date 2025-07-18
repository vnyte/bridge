import { EmptyState } from './empty-state';
import { PendingPaymentsCard } from './pending-payments-card';
import { DocumentExpiryCard } from './document-expiry-card';
import { getVehicleDocumentExpiry } from '@/server/db/vehicle';
import { getOverduePaymentsCount } from '@/server/db/payments';

export const DashboardContainer = async () => {
  const overduePaymentsCount = await getOverduePaymentsCount();
  const expiringDocuments = await getVehicleDocumentExpiry();

  const hasData = overduePaymentsCount > 0 || expiringDocuments.length > 0;

  if (!hasData) {
    return (
      <div className="h-full w-full p-6">
        <div className="flex justify-center items-center h-full pb-20">
          <EmptyState />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <PendingPaymentsCard pendingCount={overduePaymentsCount} />
        <DocumentExpiryCard documents={expiringDocuments} />
      </div>
    </div>
  );
};
