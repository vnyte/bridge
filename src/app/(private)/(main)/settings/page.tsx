import { SettingsPage } from '@/features/settings/components/settings-page';
import { getCurrentOrganizationBranchId } from '@/server/db/branch';

const BranchSettingsPage = async () => {
  const branchId = await getCurrentOrganizationBranchId();

  if (!branchId) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Error</h1>
          <p className="text-muted-foreground">Unable to find branch information.</p>
        </div>
      </div>
    );
  }

  return <SettingsPage branchId={branchId} />;
};

export default BranchSettingsPage;
