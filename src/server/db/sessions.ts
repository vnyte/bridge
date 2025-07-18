import { db } from '@/db';
import { SessionTable } from '@/db/schema';
import { auth } from '@clerk/nextjs/server';
import { eq, and, ne } from 'drizzle-orm';
import { getCurrentOrganizationBranchId } from '@/server/db/branch';

const _getSessions = async (branchId: string, vehicleId?: string, clientId?: string) => {
  const conditions = [
    eq(SessionTable.branchId, branchId),
    // Exclude cancelled and rescheduled sessions from calendar view
    ne(SessionTable.status, 'CANCELLED'),
    ne(SessionTable.status, 'RESCHEDULED'),
  ];

  if (vehicleId) {
    conditions.push(eq(SessionTable.vehicleId, vehicleId));
  }

  if (clientId) {
    conditions.push(eq(SessionTable.clientId, clientId));
  }

  const sessions = await db.query.SessionTable.findMany({
    where: and(...conditions),
    with: {
      client: {
        columns: {
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: [SessionTable.sessionDate, SessionTable.startTime],
  });

  const result = sessions.map((session) => ({
    ...session,
    clientName: `${session.client.firstName} ${session.client.lastName}`,
  }));

  console.log(`Found ${result.length} sessions for vehicle ${vehicleId || 'all'}`);
  return result;
};

export const getSessions = async (vehicleId?: string, clientId?: string) => {
  const { userId } = await auth();
  const branchId = await getCurrentOrganizationBranchId();

  if (!userId || !branchId) {
    return [];
  }

  return await _getSessions(branchId, vehicleId, clientId);
};

export const createSessions = async (
  sessions: Array<{
    clientId: string;
    vehicleId: string;
    sessionDate: string; // YYYY-MM-DD string
    startTime: string;
    endTime: string;
    status: 'SCHEDULED' | 'COMPLETED' | 'NO_SHOW' | 'CANCELLED';
    sessionNumber: number;
  }>
) => {
  const { userId } = await auth();
  const branchId = await getCurrentOrganizationBranchId();

  if (!userId || !branchId) {
    throw new Error('Unauthorized');
  }

  const sessionsWithMetadata = sessions.map((session) => ({
    ...session,
    branchId,
    createdBy: userId,
  }));

  const createdSessions = await db.insert(SessionTable).values(sessionsWithMetadata).returning();

  return createdSessions;
};

export const updateSession = async (
  sessionId: string,
  updates: {
    startTime?: string;
    endTime?: string;
    status?: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'NO_SHOW' | 'CANCELLED' | 'RESCHEDULED';
  }
) => {
  const { userId } = await auth();
  const branchId = await getCurrentOrganizationBranchId();

  if (!userId || !branchId) {
    throw new Error('Unauthorized');
  }

  const updatedSession = await db
    .update(SessionTable)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(and(eq(SessionTable.id, sessionId), eq(SessionTable.branchId, branchId)))
    .returning();

  return updatedSession[0];
};

export const cancelSession = async (sessionId: string) => {
  const { userId } = await auth();
  const branchId = await getCurrentOrganizationBranchId();

  if (!userId || !branchId) {
    throw new Error('Unauthorized');
  }

  const cancelledSession = await db
    .update(SessionTable)
    .set({
      status: 'CANCELLED',
      updatedAt: new Date(),
    })
    .where(and(eq(SessionTable.id, sessionId), eq(SessionTable.branchId, branchId)))
    .returning();

  return cancelledSession[0];
};

export const assignSessionToSlot = async (
  clientId: string,
  vehicleId: string,
  sessionDate: string, // YYYY-MM-DD string
  startTime: string,
  endTime: string
) => {
  const { userId } = await auth();
  const branchId = await getCurrentOrganizationBranchId();

  if (!userId || !branchId) {
    throw new Error('Unauthorized');
  }

  // Find a cancelled session for this client
  const cancelledSession = await db.query.SessionTable.findFirst({
    where: and(
      eq(SessionTable.clientId, clientId),
      eq(SessionTable.branchId, branchId),
      eq(SessionTable.status, 'CANCELLED')
    ),
  });

  if (!cancelledSession) {
    throw new Error('No unassigned session found for this client');
  }

  // Update the cancelled session to be scheduled with new details
  const assignedSession = await db
    .update(SessionTable)
    .set({
      vehicleId,
      sessionDate,
      startTime,
      endTime,
      status: 'SCHEDULED',
      updatedAt: new Date(),
    })
    .where(eq(SessionTable.id, cancelledSession.id))
    .returning();

  return assignedSession[0];
};

export const getSessionsByClientId = async (clientId: string) => {
  const { userId } = await auth();
  const branchId = await getCurrentOrganizationBranchId();

  if (!userId || !branchId) {
    return [];
  }

  return await _getSessions(branchId, undefined, clientId);
};

export const updateScheduledSessionsForClient = async (
  clientId: string,
  newSessions: Array<{
    sessionDate: string; // YYYY-MM-DD string format
    startTime: string;
    endTime: string;
    vehicleId: string;
    sessionNumber: number;
  }>
) => {
  const { userId } = await auth();
  const branchId = await getCurrentOrganizationBranchId();

  if (!userId || !branchId) {
    throw new Error('Unauthorized');
  }

  // Get ALL existing sessions for this client to understand what's been "touched"
  const allExistingSessions = await db.query.SessionTable.findMany({
    where: and(eq(SessionTable.clientId, clientId), eq(SessionTable.branchId, branchId)),
    orderBy: SessionTable.sessionNumber,
  });

  // Separate touched (non-SCHEDULED) and untouched (SCHEDULED) sessions
  const touchedSessions = allExistingSessions.filter((s) => s.status !== 'SCHEDULED');
  const scheduledSessions = allExistingSessions.filter((s) => s.status === 'SCHEDULED');

  // Count how many sessions we have total and how many more we need
  const totalSessionsNeeded = newSessions.length;
  const touchedSessionsCount = touchedSessions.length;
  const remainingSessionsNeeded = Math.max(0, totalSessionsNeeded - touchedSessionsCount);

  console.log(
    `Plan update: ${touchedSessionsCount} touched sessions preserved, ${remainingSessionsNeeded} new sessions needed`
  );

  const updates: Promise<unknown>[] = [];
  const creates: Promise<unknown>[] = [];
  const deletes: Promise<unknown>[] = [];

  // If we need fewer total sessions than we have touched sessions, we can't proceed
  if (totalSessionsNeeded < touchedSessionsCount) {
    throw new Error(
      `Cannot reduce plan to ${totalSessionsNeeded} sessions as ${touchedSessionsCount} sessions have already been completed/started. Minimum allowed: ${touchedSessionsCount} sessions.`
    );
  }

  // Delete all scheduled sessions (we'll recreate what's needed)
  if (scheduledSessions.length > 0) {
    for (const session of scheduledSessions) {
      deletes.push(db.delete(SessionTable).where(eq(SessionTable.id, session.id)));
    }
  }

  // Create new scheduled sessions for remaining slots
  if (remainingSessionsNeeded > 0) {
    // Find the next available session numbers (after touched sessions)
    const usedSessionNumbers = new Set(touchedSessions.map((s) => s.sessionNumber));
    const newSessionsToCreate = [];

    let nextSessionNumber = 1;
    let createdCount = 0;

    // Generate new sessions with available session numbers
    for (const newSession of newSessions) {
      // Find next available session number
      while (usedSessionNumbers.has(nextSessionNumber)) {
        nextSessionNumber++;
      }

      if (createdCount < remainingSessionsNeeded) {
        newSessionsToCreate.push({
          ...newSession,
          sessionNumber: nextSessionNumber,
          clientId,
          branchId,
          createdBy: userId,
          status: 'SCHEDULED' as const,
        });
        usedSessionNumbers.add(nextSessionNumber);
        createdCount++;
      }
      nextSessionNumber++;
    }

    if (newSessionsToCreate.length > 0) {
      creates.push(db.insert(SessionTable).values(newSessionsToCreate));
    }
  }

  // Execute all operations
  await Promise.all([...updates, ...creates, ...deletes]);

  return {
    updated: 0, // We don't update existing sessions, only delete and recreate
    created: remainingSessionsNeeded,
    deleted: scheduledSessions.length,
    preserved: touchedSessionsCount,
    message: `${touchedSessionsCount} completed/started sessions preserved, ${scheduledSessions.length} scheduled sessions updated, ${remainingSessionsNeeded} new sessions created`,
  };
};

export type Session = Awaited<ReturnType<typeof getSessions>>[0];
