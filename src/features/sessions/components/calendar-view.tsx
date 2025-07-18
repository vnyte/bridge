'use client';

import { useState } from 'react';
import { format, addDays, addMinutes, startOfWeek, endOfWeek } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar, Trash2 } from 'lucide-react';
import { useVehicles } from '@/hooks/vehicles';
import { useSessions } from '../hooks/sessions';
import { updateSession, cancelSession, assignSessionToSlot } from '@/server/actions/sessions';
import type { Session } from '@/server/db/sessions';
import { dateToString, formatDateForDisplay } from '@/lib/date-utils';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { PopConfirm } from '@/components/ui/pop-confirm';
import { cn } from '@/lib/utils';
import { SessionTimeEditor } from './session-time-editor';
import { SessionAssignmentModal } from './session-assignment-modal';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

// Generate time slots from 6:00 AM to 8:00 PM in 30-minute intervals
const timeSlots = Array.from({ length: 28 }, (_, i) => {
  const startTime = new Date();
  startTime.setHours(6, 0, 0, 0);
  const time = addMinutes(startTime, i * 30);
  return {
    time: format(time, 'h:mm a'),
    hour: time.getHours(),
    minute: time.getMinutes(),
  };
});

// Generate avatar colors for clients
const getAvatarColor = (name: string) => {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-orange-500',
    'bg-red-500',
    'bg-teal-500',
    'bg-indigo-500',
    'bg-pink-500',
  ];
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

export const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{
    time: string;
    hour: number;
    minute: number;
    date?: Date;
  } | null>(null);

  const { data: vehicles, isLoading } = useVehicles();
  const { data: sessions = [], mutate } = useSessions(selectedVehicle);

  // Debug logging
  console.log('Calendar - Selected vehicle:', selectedVehicle);
  console.log('Calendar - Sessions data:', sessions);

  // Generate week dates for week view
  const getWeekDates = () => {
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 }); // Sunday start
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  };

  const getSessionForSlot = (timeSlot: { hour: number; minute: number }, date?: Date) => {
    const targetDate = date || selectedDate;
    const selectedDateStr = format(targetDate, 'yyyy-MM-dd');

    // Format the time slot in the same format as stored in the database (HH:MM:00)
    // Ensure hours and minutes are padded with leading zeros
    const formattedHour = timeSlot.hour.toString().padStart(2, '0');
    const formattedMinute = timeSlot.minute.toString().padStart(2, '0');
    const formattedTimeSlot = `${formattedHour}:${formattedMinute}:00`;

    console.log(
      `Looking for sessions on ${selectedDateStr} at formatted time: ${formattedTimeSlot}`
    );

    // Find sessions for the selected date
    const sessionsForSelectedDate = sessions.filter((session) => {
      // Use string comparison directly since sessionDate is already YYYY-MM-DD format
      return session.sessionDate === selectedDateStr;
    });

    if (sessionsForSelectedDate.length > 0) {
      console.log(
        'Sessions for this date:',
        sessionsForSelectedDate.map((s) => ({
          id: s.id,
          startTime: s.startTime,
          clientName: s.clientName,
        }))
      );
    }

    // Find the session that matches both date and time
    const foundSession = sessions.find((session) => {
      // Direct string comparison since sessionDate is already YYYY-MM-DD format
      const dateMatch = session.sessionDate === selectedDateStr;

      // Compare the formatted time slot with the session's startTime
      // The session.startTime might already be in HH:MM:00 format from the database
      const timeMatch =
        session.startTime === formattedTimeSlot ||
        // Also check without seconds in case it's stored differently
        session.startTime === `${formattedHour}:${formattedMinute}`;

      if (dateMatch) {
        console.log(`Session ${session.id} time comparison:`, {
          sessionStartTime: session.startTime,
          formattedTimeSlot,
          timeMatch,
          overall: dateMatch && timeMatch,
        });
      }

      return dateMatch && timeMatch;
    });

    return foundSession;
  };

  const handleSessionClick = (session: Session) => {
    setSelectedSession(session);
  };

  const handleDeleteSession = async (session: Session) => {
    console.log('Deleting session:', session);
    try {
      const result = await cancelSession(session.id);

      if (!result.error) {
        // Refresh the sessions data
        mutate();
        setSelectedSession(null);
      } else {
        console.error('Failed to cancel session:', result.message);
      }
    } catch (error) {
      console.error('Error cancelling session:', error);
    }
  };

  const closeSessionModal = () => {
    setSelectedSession(null);
  };

  const handleEditTime = () => {
    setIsEditingTime(true);
  };

  const handleSaveTimeEdit = async (
    sessionId: string,
    newStartTime: string,
    newEndTime: string
  ) => {
    try {
      const result = await updateSession(sessionId, {
        startTime: newStartTime,
        endTime: newEndTime,
      });

      if (!result.error) {
        // Refresh the sessions data
        mutate();
        setIsEditingTime(false);
        setSelectedSession(null);
      } else {
        console.error('Failed to update session:', result.message);
      }
    } catch (error) {
      console.error('Error updating session:', error);
    }
  };

  const handleCancelTimeEdit = () => {
    setIsEditingTime(false);
  };

  const handleEmptySlotClick = (
    timeSlot: { time: string; hour: number; minute: number },
    date?: Date
  ) => {
    if (!selectedVehicle) {
      alert('Please select a vehicle first');
      return;
    }
    setSelectedTimeSlot({ ...timeSlot, date: date || selectedDate });
    setIsAssignmentModalOpen(true);
  };

  const handleSessionAssignment = async (clientId: string) => {
    if (!selectedTimeSlot || !selectedVehicle) return;

    try {
      // Calculate end time (default 30 minutes)
      const startTime = `${selectedTimeSlot.hour.toString().padStart(2, '0')}:${selectedTimeSlot.minute.toString().padStart(2, '0')}`;
      const endMinutes = selectedTimeSlot.minute + 30;
      const endHour = endMinutes >= 60 ? selectedTimeSlot.hour + 1 : selectedTimeSlot.hour;
      const adjustedEndMinutes = endMinutes >= 60 ? endMinutes - 60 : endMinutes;
      const endTime = `${endHour.toString().padStart(2, '0')}:${adjustedEndMinutes.toString().padStart(2, '0')}`;

      const result = await assignSessionToSlot(
        clientId,
        selectedVehicle,
        dateToString(selectedTimeSlot.date || selectedDate),
        startTime,
        endTime
      );

      if (!result.error) {
        // Refresh the sessions data
        mutate();
        setIsAssignmentModalOpen(false);
        setSelectedTimeSlot(null);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error assigning session:', error);
      alert('Failed to assign session');
    }
  };

  const closeAssignmentModal = () => {
    setIsAssignmentModalOpen(false);
    setSelectedTimeSlot(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Session Availability</h1>

      {/* Controls Row */}
      <div className="mb-6 flex items-end justify-between gap-4">
        {/* Vehicle Selector */}
        <div className="w-64 pt-4">
          <label className="block text-sm font-medium mb-2">Vehicle</label>
          <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
            <SelectTrigger>
              <SelectValue placeholder="Select Vehicle" />
            </SelectTrigger>
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
        </div>

        {/* View Mode Selector and Date Navigation */}
        <div className="flex items-center gap-4">
          {/* View Mode Dropdown */}
          <div className="w-32">
            <Select value={viewMode} onValueChange={(value: 'day' | 'week') => setViewMode(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="week">Week</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Navigation */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedDate(addDays(selectedDate, viewMode === 'week' ? -7 : -1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="min-w-[140px] justify-start text-left font-normal"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {viewMode === 'week'
                    ? `${format(startOfWeek(selectedDate, { weekStartsOn: 0 }), 'dd MMM')} - ${format(endOfWeek(selectedDate, { weekStartsOn: 0 }), 'dd MMM yyyy')}`
                    : format(selectedDate, 'dd/MM/yyyy')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (date) {
                      setSelectedDate(date);
                      setIsCalendarOpen(false);
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedDate(addDays(selectedDate, viewMode === 'week' ? 7 : 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="border overflow-hidden bg-white">
        {!selectedVehicle ? (
          <div className="p-8 text-center text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">Select a Vehicle</h3>
            <p>Please select a vehicle from the dropdown above to view its session availability.</p>
          </div>
        ) : viewMode === 'day' ? (
          /* Day View */
          <div className="max-h-[calc(100vh-16rem)] overflow-y-auto">
            {timeSlots.map((timeSlot, timeIndex) => {
              const session = getSessionForSlot(timeSlot);
              return (
                <div key={timeIndex} className="flex items-center border-b border-gray-100 h-12">
                  {/* Time Column */}
                  <div className="w-24 p-4 text-sm text-gray-600 font-medium">{timeSlot.time}</div>

                  {/* Session Column */}
                  <div className="flex-1 h-full">
                    {session ? (
                      <div
                        className="flex items-center gap-3 px-4 cursor-pointer hover:bg-blue-50 transition-colors h-12"
                        onClick={() => handleSessionClick(session)}
                      >
                        {/* Avatar */}
                        <div
                          className={cn(
                            'w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium',
                            getAvatarColor(session.clientName)
                          )}
                        >
                          {session.clientName
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()}
                        </div>

                        {/* Client Name */}
                        <span className="font-medium text-gray-900">{session.clientName}</span>

                        {/* Session Time Range */}
                        <span className="text-sm text-gray-500 ml-auto">
                          {session.startTime} - {session.endTime}
                        </span>
                      </div>
                    ) : (
                      <div
                        className="h-12 cursor-pointer hover:bg-blue-50 flex items-center justify-center text-gray-400 text-sm transition-colors border-2 border-dashed border-transparent hover:border-blue-300"
                        onClick={() => handleEmptySlotClick(timeSlot)}
                        title="Click to assign a session"
                      ></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Week View */
          <div className="max-h-[calc(100vh-16rem)] overflow-auto">
            {/* Week Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
              <div className="flex">
                <div className="w-20 p-2 text-sm font-medium text-gray-600 border-r"></div>
                {getWeekDates().map((date, dayIndex) => (
                  <div
                    key={dayIndex}
                    className="flex-1 p-2 text-center border-r border-gray-100 last:border-r-0"
                  >
                    <div className="text-xs text-gray-500 uppercase">{format(date, 'EEE')}</div>
                    <div className="text-sm font-medium">{format(date, 'd')}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Time Slots */}
            {timeSlots.map((timeSlot, timeIndex) => (
              <div key={timeIndex} className="flex border-b border-gray-100">
                {/* Time Column */}
                <div className="w-20 p-2 text-xs text-gray-600 font-medium border-r border-gray-200 flex items-center">
                  {format(new Date().setHours(timeSlot.hour, timeSlot.minute, 0, 0), 'h:mm a')}
                </div>

                {/* Day Columns */}
                {getWeekDates().map((date, dayIndex) => {
                  const session = getSessionForSlot(timeSlot, date);
                  return (
                    <div
                      key={dayIndex}
                      className="flex-1 h-12 border-r border-gray-100 last:border-r-0"
                    >
                      {session ? (
                        <div
                          className="h-full flex items-center gap-2 px-2 cursor-pointer hover:bg-blue-50 transition-colors"
                          onClick={() => handleSessionClick(session)}
                        >
                          <div
                            className={cn(
                              'w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium',
                              getAvatarColor(session.clientName)
                            )}
                          >
                            {session.clientName
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .toUpperCase()}
                          </div>
                          <span className="text-xs font-medium text-gray-900 truncate">
                            {session.clientName}
                          </span>
                        </div>
                      ) : (
                        <div
                          className="h-full cursor-pointer hover:bg-blue-50 transition-colors border-2 border-dashed border-transparent hover:border-blue-300"
                          onClick={() => handleEmptySlotClick(timeSlot, date)}
                          title="Click to assign a session"
                        ></div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Session Detail Modal */}
      <Dialog open={!!selectedSession} onOpenChange={(open) => !open && closeSessionModal()}>
        <DialogContent
          className="w-96 max-w-[90vw]"
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Session Details</DialogTitle>
          </DialogHeader>

          {selectedSession && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'w-10 h-10 flex rounded-full items-center justify-center text-white font-medium',
                    getAvatarColor(selectedSession.clientName)
                  )}
                >
                  {selectedSession.clientName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </div>
                <div>
                  <p className="font-medium">{selectedSession.clientName}</p>
                  <p className="text-sm text-gray-500">
                    {formatDateForDisplay(selectedSession.sessionDate)}
                  </p>
                </div>
              </div>

              <div className="border-t pt-3">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Time:</strong> {selectedSession.startTime} - {selectedSession.endTime}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Status:</strong> {selectedSession.status.replace('_', ' ')}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Session:</strong> #{selectedSession.sessionNumber}
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={handleEditTime}>
              Edit Time
            </Button>
            {selectedSession && (
              <PopConfirm
                title="Cancel Session"
                description={`Are you sure you want to cancel this session with ${selectedSession.clientName} on ${formatDateForDisplay(selectedSession.sessionDate)} at ${selectedSession.startTime}? The session will be marked as cancelled and will be counted as an unassigned session.`}
                confirmText="Cancel Session"
                cancelText="Keep Session"
                onConfirm={() => handleDeleteSession(selectedSession)}
                variant="destructive"
              >
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </PopConfirm>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Session Time Editor Modal */}
      <SessionTimeEditor
        session={selectedSession}
        open={isEditingTime}
        onSave={handleSaveTimeEdit}
        onCancel={handleCancelTimeEdit}
      />

      {/* Session Assignment Modal */}
      <SessionAssignmentModal
        isOpen={isAssignmentModalOpen}
        onClose={closeAssignmentModal}
        onAssign={handleSessionAssignment}
        timeSlot={selectedTimeSlot?.time || ''}
        date={selectedTimeSlot?.date || selectedDate}
      />
    </div>
  );
};
