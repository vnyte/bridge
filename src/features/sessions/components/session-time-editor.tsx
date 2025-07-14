'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import type { Session } from '@/server/db/sessions';

interface SessionTimeEditorProps {
  session: Session | null;
  open: boolean;
  onSave: (sessionId: string, newStartTime: string, newEndTime: string) => Promise<void>;
  onCancel: () => void;
}

const generateTimeOptions = () => {
  const times = [];
  for (let hour = 6; hour <= 20; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const displayTime = new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
      times.push({ value: timeString, label: displayTime });
    }
  }
  return times;
};

const calculateEndTime = (startTime: string, durationMinutes: number = 30): string => {
  const [hours, minutes] = startTime.split(':').map(Number);
  const startDate = new Date();
  startDate.setHours(hours, minutes, 0, 0);

  const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
  return `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
};

export const SessionTimeEditor = ({ session, open, onSave, onCancel }: SessionTimeEditorProps) => {
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState(30); // Default 30 minutes
  const [isLoading, setIsLoading] = useState(false);

  const timeOptions = generateTimeOptions();
  const endTime = startTime ? calculateEndTime(startTime, duration) : '';

  const handleSave = async () => {
    if (!session) return;
    setIsLoading(true);
    try {
      await onSave(session.id, startTime, endTime);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form when session changes or modal opens
  useEffect(() => {
    if (session && open) {
      console.log('Setting start time to:', session.startTime);
      // Handle both HH:MM and HH:MM:SS formats
      const formattedStartTime = session.startTime.includes(':')
        ? session.startTime.substring(0, 5) // Take only HH:MM part
        : session.startTime;
      setStartTime(formattedStartTime);
    }
  }, [session, open]);

  console.log('Current startTime state:', startTime);

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="w-96 max-w-[90vw]">
        <DialogHeader>
          <DialogTitle>Edit Session Time</DialogTitle>
        </DialogHeader>

        {session && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Client</label>
              <p className="text-sm text-gray-600">{session.clientName}</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Start Time</label>
              <Select value={startTime} onValueChange={setStartTime}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((time) => (
                    <SelectItem key={time.value} value={time.value}>
                      {time.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Duration</label>
              <Select
                value={duration.toString()}
                onValueChange={(value) => setDuration(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                  <SelectItem value="90">90 minutes</SelectItem>
                  <SelectItem value="120">120 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">End Time</label>
              <p className="text-sm text-gray-600">
                {endTime
                  ? new Date(`2000-01-01T${endTime}`).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })
                  : '--'}
              </p>
            </div>
          </div>
        )}

        <DialogFooter className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            className="flex-1"
            onClick={handleSave}
            disabled={isLoading}
            isLoading={isLoading}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
