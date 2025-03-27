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

export const PlanStep = () => {
  const { control } = useFormContext<AdmissionFormValues>();
  const { data: vehicles, isLoading } = useVehicles();

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Training Plan</h2>

      <div className="rounded-lg border p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

      <div className="rounded-lg border p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Plan Summary</h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="flex justify-between p-4 bg-muted rounded-md">
            <span>Total Sessions:</span>
            <span className="font-medium">{control._formValues.plan?.numberOfSessions || 0}</span>
          </div>
          <div className="flex justify-between p-4 bg-muted rounded-md">
            <span>Session Duration:</span>
            <span className="font-medium">
              {control._formValues.plan?.sessionDurationInMinutes || 0} minutes
            </span>
          </div>
          <div className="flex justify-between p-4 bg-muted rounded-md">
            <span>Total Training Hours:</span>
            <span className="font-medium">
              {(
                ((control._formValues.plan?.numberOfSessions || 0) *
                  (control._formValues.plan?.sessionDurationInMinutes || 0)) /
                60
              ).toFixed(1)}{' '}
              hours
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
