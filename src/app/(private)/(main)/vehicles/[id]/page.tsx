import { TypographyH4 } from '@/components/ui/typography';
import { VehicleForm } from '@/features/vehicles/components/form';
import { getVehicle } from '@/server/db/vehicle';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vehicle = await getVehicle(id);

  return (
    <div>
      <div className="flex gap-4 items-center pb-14">
        <Link href="/vehicles">
          <ArrowLeft className="size-5 text-gray-700" />
        </Link>
        <TypographyH4>Edit Vehicle</TypographyH4>
      </div>
      <VehicleForm vehicle={vehicle} />
    </div>
  );
}
