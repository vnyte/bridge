import { Suspense } from 'react';
import { TypographyH4 } from '@/components/ui/typography';
import MultistepForm from '@/features/admission/components/form/multistep-form';
import { ProgressBar } from '@/features/admission/components/progress-bar/progress-bar';

export default function AdmissionPage() {
  return (
    <div>
      <header className="pb-6">
        <TypographyH4>Admission Form</TypographyH4>
      </header>
      <Suspense fallback={<div>Loading...</div>}>
        <ProgressBar interactive={true} />
        <MultistepForm />
      </Suspense>
    </div>
  );
}
