import { Button } from '@/components/ui/button';
import { DashboardContainer } from '@/features/dashboard/components/dashboard-container';
import { PlusIcon } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="h-full">
      <div className="flex justify-end gap-4">
        <Button variant="secondary" size="lg">
          <Link href="/rto-services/add" className="flex gap-2 items-center text-primary">
            <PlusIcon /> RTO Services
          </Link>
        </Button>
        <Button size="lg">
          <Link href="/admission" className="flex gap-2 items-center">
            <PlusIcon /> New admission
          </Link>
        </Button>
      </div>

      <DashboardContainer />
    </div>
  );
}
