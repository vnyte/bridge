'use server';

import {
  getSessions as getSessionsFromDB,
  createSessions as createSessionsInDB,
  updateSession as updateSessionInDB,
  cancelSession as cancelSessionInDB,
  assignSessionToSlot as assignSessionToSlotInDB,
} from '@/server/db/sessions';

export const getSessions = async (vehicleId?: string) => {
  return getSessionsFromDB(vehicleId);
};

export const createSessions = async (
  sessions: Array<{
    clientId: string;
    vehicleId: string;
    sessionDate: Date;
    startTime: string;
    endTime: string;
    status: 'SCHEDULED' | 'COMPLETED' | 'NO_SHOW' | 'CANCELLED';
    sessionNumber: number;
  }>
) => {
  console.log('Creating sessions:', sessions);
  try {
    const createdSessions = await createSessionsInDB(sessions);
    return {
      error: false,
      message: `${sessions.length} sessions created successfully`,
      data: createdSessions,
    };
  } catch (error) {
    console.error('Error creating sessions:', error);
    return {
      error: true,
      message: 'Failed to create sessions',
    };
  }
};

export const updateSession = async (
  sessionId: string,
  updates: {
    startTime?: string;
    endTime?: string;
    status?: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'NO_SHOW' | 'CANCELLED';
  }
) => {
  try {
    const updatedSession = await updateSessionInDB(sessionId, updates);
    return {
      error: false,
      message: 'Session updated successfully',
      data: updatedSession,
    };
  } catch (error) {
    console.error('Error updating session:', error);
    return {
      error: true,
      message: 'Failed to update session',
    };
  }
};

export const cancelSession = async (sessionId: string) => {
  try {
    await cancelSessionInDB(sessionId);
    return {
      error: false,
      message: 'Session cancelled successfully',
    };
  } catch (error) {
    console.error('Error cancelling session:', error);
    return {
      error: true,
      message: 'Failed to cancel session',
    };
  }
};

export const assignSessionToSlot = async (
  clientId: string,
  vehicleId: string,
  sessionDate: Date,
  startTime: string,
  endTime: string
) => {
  try {
    const assignedSession = await assignSessionToSlotInDB(
      clientId,
      vehicleId,
      sessionDate,
      startTime,
      endTime
    );
    return {
      error: false,
      message: 'Session assigned successfully',
      data: assignedSession,
    };
  } catch (error) {
    console.error('Error assigning session:', error);
    return {
      error: true,
      message: error instanceof Error ? error.message : 'Failed to assign session',
    };
  }
};
