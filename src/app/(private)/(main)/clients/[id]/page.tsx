import { getClient } from '@/server/db/client';
import { getCurrentOrganizationBranch } from '@/server/db/branch';
import { notFound } from 'next/navigation';
import { ClientAdmissionForm } from '@/features/clients/components/client-admission-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [client, branch] = await Promise.all([getClient(id), getCurrentOrganizationBranch()]);

  if (!client || !branch) {
    notFound();
  }

  const branchConfig = {
    workingDays: branch.workingDays || [],
    operatingHours: branch.operatingHours || { start: '09:00', end: '17:00' },
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Link href="/clients">
          <Button variant="link" size="sm" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Clients
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">
          {client.firstName} {client.middleName} {client.lastName}
        </h1>
        <p className="text-muted-foreground">Complete or update client information</p>
      </div>
      <ClientAdmissionForm client={client} branchConfig={branchConfig} />
    </div>
  );
}
