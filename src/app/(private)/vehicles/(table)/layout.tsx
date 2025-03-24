import { Button } from '@/components/ui/button';
import { TypographyH4 } from '@/components/ui/typography';
import { VehicleSearchBar } from '@/features/vehicles/components/search-bar';
import Link from 'next/link';

export default function VehiclesTableLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-10">
      <TypographyH4>Vehicles</TypographyH4>
      <div className="flex justify-between items-center">
        <VehicleSearchBar />
        <Link href="/vehicles/add">
          <Button>Add Vehicle</Button>
        </Link>
      </div>
      {children}
    </div>
  );
}
