import { EmptyState } from './empty-state';
import { PendingPaymentsCard } from './pending-payments-card';
import { AppointmentsWidget } from './appointments-widget';
import { InstructorStatusCard } from './instructor-status-card';
import { getVehicleDocumentExpiry } from '@/server/db/vehicle';
import { getOverduePaymentsCount } from '@/server/db/payments';
import { getInstructorStatusCount } from '@/server/db/staff';
import { getAdmissionStatistics } from '@/server/db/client';
import AdmissionOverview from './admission-overview';

export const DashboardContainer = async () => {
  const overduePaymentsCount = await getOverduePaymentsCount();
  const expiringDocuments = await getVehicleDocumentExpiry();
  const instructorStatusCount = await getInstructorStatusCount();
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
    <div className="h-full w-full py-10 space-y-6" data-testid="dashboard-container">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8">
          <AppointmentsWidget />
        </div>
        <div className="col-span-4 h-full">
          <PendingPaymentsCard pendingCount={overduePaymentsCount} />
        </div>
      </div>
      <div className="grid grid-cols-12 gap-6">
        {/* <div className="col-span-4">
          <DocumentExpiryCard documents={expiringDocuments} />
        </div> */}
        <div className="col-span-4">
          <InstructorStatusCard statusCount={instructorStatusCount} />
        </div>
        <div className="col-span-8">
          <AdmissionOverview initialData={admissionData} initialMonths={6} />
        </div>
      </div>
    </div>
  );
};
