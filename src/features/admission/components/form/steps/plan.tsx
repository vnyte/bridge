'use client';

import { useFormContext } from 'react-hook-form';
import { AdmissionFormValues } from '@/features/admission/types';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { useVehicles } from '@/hooks/use-vehicles';
import { TypographyH5 } from '@/components/ui/typography';

export const PlanStep = () => {
  const { control } = useFormContext<AdmissionFormValues>();
  const { data: vehicles, isLoading } = useVehicles();

  return (
    <div className="space-y-10">
      {/* Training Plan */}
      <div className="grid grid-cols-12">
        <TypographyH5 className="col-span-3">Vehicle</TypographyH5>
        <div className="grid grid-cols-3 col-span-9 gap-6">
          <FormField
            control={control}
            name="plan.vehicleId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vehicle*</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isLoading ? (
                      <SelectItem value="loading" disabled>
                        Loading vehicles...
                      </SelectItem>
                    ) : vehicles?.length === 0 ? (
                      <SelectItem value="no-vehicles" disabled>
                        No vehicles available
                      </SelectItem>
                    ) : (
                      vehicles?.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-12">
        <TypographyH5 className="col-span-3">Session Details</TypographyH5>
        <div className="grid grid-cols-3 col-span-9 gap-6">
          <FormField
            control={control}
            name="plan.numberOfSessions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Sessions*</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Number of sessions"
                    value={field.value || ''}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="plan.sessionDurationInMinutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Session Duration (minutes)*</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Duration in minutes"
                    value={field.value || ''}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      <div className="grid grid-cols-12">
        <span className="col-span-3" />
        <div className="grid grid-cols-3 col-span-9 gap-6">
          <FormField
            control={control}
            name="plan.joiningDate"
            render={() => (
              <FormItem>
                <FormLabel>Joining Date*</FormLabel>
                <FormControl>
                  <DatePicker
                    name="plan.joiningDate"
                    control={control}
                    placeholderText="Select joining date"
                    minDate={new Date()}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};
