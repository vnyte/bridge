import { TypographyH4 } from '@/components/ui/typography';
import { StaffForm } from '@/features/staff/components/form';

export default async function AddStaffPage() {
  return (
    <div className="space-y-10">
      <TypographyH4>Add Staff Member</TypographyH4>
      <StaffForm />
    </div>
  );
}
