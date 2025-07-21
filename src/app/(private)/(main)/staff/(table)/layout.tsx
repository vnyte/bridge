import { StaffHeader } from '@/features/staff/components/staff-header';

export default function StaffTableLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-10">
      <StaffHeader />
      {children}
    </div>
  );
}
