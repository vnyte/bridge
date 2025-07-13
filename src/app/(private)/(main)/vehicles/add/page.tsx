import { TypographyH4 } from '@/components/ui/typography';
import { VehicleForm } from '@/features/vehicles/components/form';

export default function AddVehiclePage() {
  return (
    <div>
      <TypographyH4 className="pb-14">Add Vehicle</TypographyH4>
      <VehicleForm />
    </div>
  );
}
