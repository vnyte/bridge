import { Suspense } from 'react';
import { TypographyH4 } from '@/components/ui/typography';
import MultistepForm from '@/features/admission/components/form/multistep-form';
import { getBranchConfig } from '@/features/admission/server/action';

export default async function AdmissionPage() {
  const branchConfigResult = await getBranchConfig();

  if (branchConfigResult.error || !branchConfigResult.data) {
    return (
      <div>
        <header className="pb-6">
          <TypographyH4>Admission Form</TypographyH4>
        </header>
        <div className="text-red-500">Error loading branch configuration. Please try again.</div>
      </div>
    );
  }

  return (
    <div data-testid="admission-page">
      <header className="pb-6">
        <TypographyH4 data-testid="admission-page-heading">Admission Form</TypographyH4>
      </header>
      <Suspense fallback={<div>Loading...</div>}>
        <MultistepForm branchConfig={branchConfigResult.data} />
      </Suspense>
    </div>
  );
}
