'use client';

import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, X } from 'lucide-react';
import { getSessions } from '@/server/actions/sessions';
import type { Session } from '@/server/db/sessions';

interface SessionAvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleId: string;
  selectedDate: Date;
  branchConfig: {
    workingDays: number[];
    operatingHours: { start: string; end: string };
  };
  onTimeSelect?: (time: string) => void;
}

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

export const SessionAvailabilityModal = ({
  isOpen,
  onClose,
  vehicleId,
  selectedDate,
  branchConfig,
  onTimeSelect,
}: SessionAvailabilityModalProps) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);

  const timeSlots = generateTimeSlots(branchConfig.operatingHours);
  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');

  // Get occupied time slots for the selected date
  const occupiedSlots = sessions
    .filter((session) => {
      const sessionDate = format(new Date(session.sessionDate), 'yyyy-MM-dd');
      return sessionDate === selectedDateStr;
    })
    .map((session) => session.startTime.substring(0, 5));

  const loadSessions = useCallback(async () => {
    if (!vehicleId) return;

    setLoading(true);
    try {
      const sessionData = await getSessions(vehicleId);
      setSessions(sessionData);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  }, [vehicleId]);

  useEffect(() => {
    if (isOpen && vehicleId) {
      loadSessions();
    }
  }, [isOpen, loadSessions, vehicleId]);

  const handleTimeSelect = (timeValue: string) => {
    if (onTimeSelect) {
      onTimeSelect(timeValue);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Session Availability - {format(selectedDate, 'PPP')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            Operating Hours: {branchConfig.operatingHours.start} - {branchConfig.operatingHours.end}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-gray-500">Loading availability...</div>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              <div className="grid grid-cols-4 gap-3">
                {timeSlots.map((slot) => {
                  const isOccupied = occupiedSlots.includes(slot.value);
                  const isAvailable = !isOccupied;

                  return (
                    <div
                      key={slot.value}
                      className={`
                        p-3 rounded-lg border text-center cursor-pointer transition-colors
                        ${
                          isAvailable
                            ? 'border-green-200 bg-green-50 hover:bg-green-100 text-green-800'
                            : 'border-red-200 bg-red-50 text-red-800 cursor-not-allowed'
                        }
                      `}
                      onClick={() => isAvailable && handleTimeSelect(slot.value)}
                    >
                      <div className="flex items-center justify-center gap-1 mb-1">
                        {isAvailable ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <X className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div className="text-sm font-medium">{slot.label}</div>
                      <div className="text-xs">{isAvailable ? 'Available' : 'Occupied'}</div>
                    </div>
                  );
                })}
              </div>

              {timeSlots.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No time slots available for the current operating hours.</p>
                  <p className="text-sm mt-2">
                    Operating Hours: {branchConfig.operatingHours.start} -{' '}
                    {branchConfig.operatingHours.end}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Available</span>
              </div>
              <div className="flex items-center gap-1">
                <X className="h-4 w-4 text-red-600" />
                <span>Occupied</span>
              </div>
            </div>

            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
