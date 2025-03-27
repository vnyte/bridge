import { TypographyH4 } from '@/components/ui/typography';
import { ProgressBar } from '@/features/admission/components/progress-bar';

export default function AdmissionPage() {
  return (
    <div>
      <header className="pb-10">
        <TypographyH4>Admission Form</TypographyH4>
      </header>
      <ProgressBar interactive={false} />
    </div>
  );
}
