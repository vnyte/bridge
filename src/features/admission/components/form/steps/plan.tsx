'use client';

import { useFormContext } from 'react-hook-form';
import { useState, useEffect, useCallback } from 'react';
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
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { useVehicles } from '@/hooks/vehicles';
import { TypographyH5 } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { getSessions } from '@/server/actions/sessions';
import { SessionAvailabilityModal } from '../session-availability-modal';

// Generate time slots based on branch operating hours
const generateTimeSlots = (operatingHours: { start: string; end: string }) => {
  const slots = [];

  // Parse start and end hours
  const [startHour, startMinute] = operatingHours.start.split(':').map(Number);
  const [endHour, endMinute] = operatingHours.end.split(':').map(Number);

  const startTime = startHour * 60 + startMinute; // Convert to minutes
  const endTime = endHour * 60 + endMinute; // Convert to minutes

  // Generate 30-minute slots within operating hours
  for (let timeInMinutes = startTime; timeInMinutes < endTime; timeInMinutes += 30) {
    const hour = Math.floor(timeInMinutes / 60);
    const minute = timeInMinutes % 60;

    const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    const displayTime = new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    slots.push({ value: timeString, label: displayTime });
  }

  return slots;
};

interface PlanStepProps {
  branchConfig: {
    workingDays: number[];
    operatingHours: { start: string; end: string };
  };
  currentClientId?: string; // For highlighting existing client sessions
}

export const PlanStep = ({ branchConfig, currentClientId }: PlanStepProps) => {
  const { control, watch, setValue } = useFormContext<AdmissionFormValues>();
  const { data: vehicles, isLoading } = useVehicles();
  const [slotConflict, setSlotConflict] = useState<{
    hasConflict: boolean;
    availableSlots: string[];
  }>({ hasConflict: false, availableSlots: [] });
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);

  const selectedVehicleId = watch('plan.vehicleId');
  const selectedDateTime = watch('plan.joiningDate');
  const numberOfSessions = watch('plan.numberOfSessions');

  const checkSlotAvailability = useCallback(
    async (vehicleId: string, dateTime: Date) => {
      if (!vehicleId || !dateTime) return;

      setCheckingAvailability(true);
      try {
        // Get all sessions for the selected vehicle
        const sessions = await getSessions(vehicleId);

        const selectedDate = format(dateTime, 'yyyy-MM-dd');
        const selectedTime = format(dateTime, 'HH:mm');

        // Check if the selected slot is already taken
        const conflictSession = sessions.find((session) => {
          const sessionDate = session.sessionDate; // Already in YYYY-MM-DD format
          const sessionTime = session.startTime.substring(0, 5); // Remove seconds if present
          return sessionDate === selectedDate && sessionTime === selectedTime;
        });

        if (conflictSession) {
          // Find available slots around the selected time
          const allTimeSlots = generateTimeSlots(branchConfig.operatingHours);
          const occupiedSlots = sessions
            .filter((session) => {
              const sessionDate = session.sessionDate; // Already in YYYY-MM-DD format
              return sessionDate === selectedDate;
            })
            .map((session) => session.startTime.substring(0, 5));

          // Find the index of the selected time slot
          const selectedTimeIndex = allTimeSlots.findIndex((slot) => slot.value === selectedTime);

          // Get time slots around the selected time (2 before, 2 after)
          const nearbySlots: string[] = [];
          for (let i = selectedTimeIndex - 2; i <= selectedTimeIndex + 2; i++) {
            if (i >= 0 && i < allTimeSlots.length && i !== selectedTimeIndex) {
              const slot = allTimeSlots[i];
              if (!occupiedSlots.includes(slot.value)) {
                nearbySlots.push(slot.label);
              }
            }
          }

          // If we don't have enough nearby slots, add more from available slots
          if (nearbySlots.length < 4) {
            const additionalSlots = allTimeSlots
              .filter(
                (slot) => !occupiedSlots.includes(slot.value) && !nearbySlots.includes(slot.label)
              )
              .slice(0, 4 - nearbySlots.length)
              .map((slot) => slot.label);
            nearbySlots.push(...additionalSlots);
          }

          setSlotConflict({
            hasConflict: true,
            availableSlots: nearbySlots.slice(0, 4), // Limit to 4 slots
          });
        } else {
          setSlotConflict({ hasConflict: false, availableSlots: [] });
        }
      } catch (error) {
        console.error('Error checking slot availability:', error);
      } finally {
        setCheckingAvailability(false);
      }
    },
    [branchConfig.operatingHours]
  );

  useEffect(() => {
    if (selectedVehicleId && selectedDateTime) {
      checkSlotAvailability(selectedVehicleId, selectedDateTime);
    }
  }, [selectedVehicleId, selectedDateTime, checkSlotAvailability]);

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
                <FormLabel required>Vehicle</FormLabel>
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
          <div className="space-y-3">
            <FormField
              control={control}
              name="plan.joiningDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Joining Date & Time</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      selected={field.value}
                      onChange={field.onChange}
                      placeholderText="Select joining date and time"
                      maxDate={new Date(2100, 0, 1)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Slot Availability Status */}
            {checkingAvailability && (
              <div className="text-sm text-gray-500">Checking availability...</div>
            )}

            {!checkingAvailability && selectedDateTime && selectedVehicleId && (
              <>
                {slotConflict.hasConflict ? (
                  <div className="p-3 border border-orange-200 bg-orange-50 rounded-md">
                    <div className="flex gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <div className="text-orange-800">
                        <div className="space-y-2">
                          <p className="font-medium">Slot Not Available</p>
                          <p className="text-sm">
                            The selected time slot is already occupied. Here are some available
                            options:
                          </p>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            {slotConflict.availableSlots.map((slot, index) => (
                              <div key={index} className="flex items-center gap-1 text-sm">
                                <CheckCircle className="h-3 w-3 text-green-600" />
                                <span>{slot}</span>
                              </div>
                            ))}
                          </div>
                          {slotConflict.availableSlots.length === 0 && (
                            <p className="text-sm text-orange-700">
                              No available slots for this date. Please select a different date.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>Time slot available</span>
                  </div>
                )}
              </>
            )}

            {/* Session Availability Button */}
            {selectedVehicleId && selectedDateTime && (
              <Button
                type="button"
                variant="outline"
                className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"
                onClick={() => setShowAvailabilityModal(true)}
              >
                Session availability
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Session Availability Modal */}
      {selectedVehicleId && selectedDateTime && (
        <SessionAvailabilityModal
          isOpen={showAvailabilityModal}
          onClose={() => setShowAvailabilityModal(false)}
          vehicleId={selectedVehicleId}
          selectedDate={selectedDateTime}
          branchConfig={branchConfig}
          currentClientId={currentClientId}
          numberOfSessions={numberOfSessions || 1}
          onTimeSelect={(timeValue: string) => {
            // Update the form with the selected time
            const [hours, minutes] = timeValue.split(':').map(Number);
            const newDateTime = new Date(selectedDateTime);
            newDateTime.setHours(hours, minutes, 0, 0);
            setValue('plan.joiningDate', newDateTime);
          }}
        />
      )}
    </div>
  );
};
