import { EmptyState } from './empty-state';
import { PendingPaymentsCard } from './pending-payments-card';
import { DocumentExpiryCard } from './document-expiry-card';
import { AppointmentsWidget } from './appointments-widget';
import { getVehicleDocumentExpiry } from '@/server/db/vehicle';
import { getOverduePaymentsCount } from '@/server/db/payments';
import { getAdmissionStatistics } from '@/server/db/client';
import AdmissionOverview from './admission-overview';

export const DashboardContainer = async () => {
  const overduePaymentsCount = await getOverduePaymentsCount();
  const expiringDocuments = await getVehicleDocumentExpiry();
  const admissionData = await getAdmissionStatistics(6); // Default to 6 months

  const hasData = overduePaymentsCount > 0 || expiringDocuments.length > 0 || true;

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
    <div className="h-full w-full py-10 space-y-6">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8">
          <AppointmentsWidget />
        </div>
        <div className="col-span-4 h-full">
          <PendingPaymentsCard pendingCount={overduePaymentsCount} />
        </div>
      </div>
      <div className="flex gap-6">
        <DocumentExpiryCard documents={expiringDocuments} />
        <AdmissionOverview initialData={admissionData} initialMonths={6} />
      </div>
    </div>
  );
};
