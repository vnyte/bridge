'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { RTOOfficeSelect } from '@/components/ui/rto-office-select';
import { toast } from 'sonner';
import { branchSettingsSchema, type BranchSettings } from '../types';
import { updateBranchSettings } from '../server/actions';
import {
  DEFAULT_WORKING_DAYS,
  DEFAULT_OPERATING_HOURS,
  DAYS_OF_WEEK,
} from '@/lib/constants/business';

interface SettingsFormProps {
  branchId: string;
  initialData?: BranchSettings;
}

export const SettingsForm = ({ branchId, initialData }: SettingsFormProps) => {
  const [isPending, setIsPending] = useState(false);

  const form = useForm<BranchSettings>({
    resolver: zodResolver(branchSettingsSchema),
    defaultValues: initialData || {
      workingDays: DEFAULT_WORKING_DAYS,
      operatingHours: DEFAULT_OPERATING_HOURS,
      defaultRtoOffice: '',
    },
  });

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = form;
  const workingDays = watch('workingDays');
  const operatingHours = watch('operatingHours');
  const defaultRtoOffice = watch('defaultRtoOffice');

  const handleWorkingDayToggle = (dayId: number) => {
    const currentDays = workingDays || [];
    const newDays = currentDays.includes(dayId)
      ? currentDays.filter((id) => id !== dayId)
      : [...currentDays, dayId].sort();
    setValue('workingDays', newDays);
  };

  const onSubmit = async (data: BranchSettings) => {
    setIsPending(true);
    try {
      const result = await updateBranchSettings(branchId, data);
      if (result.success) {
        toast.success('Settings updated successfully');
      } else {
        toast.error(result.error || 'Failed to update settings');
      }
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Working Days Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Working Days
          </CardTitle>
          <CardDescription>Select which days of the week your branch operates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-4">
            {DAYS_OF_WEEK.map((day) => (
              <div key={day.id} className="flex flex-col items-center space-y-2">
                <Label htmlFor={`day-${day.id}`} className="text-sm font-medium">
                  {day.short}
                </Label>
                <Checkbox
                  id={`day-${day.id}`}
                  checked={workingDays?.includes(day.id) || false}
                  onCheckedChange={() => handleWorkingDayToggle(day.id)}
                />
              </div>
            ))}
          </div>
          {errors.workingDays && (
            <p className="text-sm text-red-500 mt-2">{errors.workingDays.message}</p>
          )}
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Selected days:</strong>{' '}
              {!workingDays || workingDays.length === 0
                ? 'No working days selected'
                : workingDays.map((id) => DAYS_OF_WEEK.find((d) => d.id === id)?.label).join(', ')}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Operating Hours Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Operating Hours
          </CardTitle>
          <CardDescription>Set the daily operating hours for session scheduling</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-time">Start Time</Label>
              <Input id="start-time" type="time" {...register('operatingHours.start')} />
              {errors.operatingHours?.start && (
                <p className="text-sm text-red-500">{errors.operatingHours.start.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-time">End Time</Label>
              <Input id="end-time" type="time" {...register('operatingHours.end')} />
              {errors.operatingHours?.end && (
                <p className="text-sm text-red-500">{errors.operatingHours.end.message}</p>
              )}
            </div>
          </div>
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Operating hours:</strong>{' '}
              {operatingHours?.start || DEFAULT_OPERATING_HOURS.start} -{' '}
              {operatingHours?.end || DEFAULT_OPERATING_HOURS.end}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Default RTO Office Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Default RTO Office
          </CardTitle>
          <CardDescription>
            Set the default RTO office for new RTO service applications from this branch
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="default-rto-office">RTO Office</Label>
              <RTOOfficeSelect
                value={defaultRtoOffice || ''}
                onValueChange={(value) => setValue('defaultRtoOffice', value)}
                placeholder="Select default RTO office..."
              />
              {errors.defaultRtoOffice && (
                <p className="text-sm text-red-500">{errors.defaultRtoOffice.message}</p>
              )}
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Current default:</strong>{' '}
                {defaultRtoOffice ? defaultRtoOffice : 'No default RTO office set'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                This will be pre-selected when creating new RTO service applications
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={isPending}>
          {isPending ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </form>
  );
};
