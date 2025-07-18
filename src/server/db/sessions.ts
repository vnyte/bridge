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
    sessionDate: Date;
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
  sessionDate: Date,
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
    sessionDate: Date;
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

  // Get existing SCHEDULED sessions for this client
  const existingSessions = await db.query.SessionTable.findMany({
    where: and(
      eq(SessionTable.clientId, clientId),
      eq(SessionTable.branchId, branchId),
      eq(SessionTable.status, 'SCHEDULED')
    ),
    orderBy: SessionTable.sessionNumber,
  });

  const updates = [];
  const creates = [];
  const deletes = [];

  // Update existing sessions with new data
  for (let i = 0; i < Math.min(existingSessions.length, newSessions.length); i++) {
    const existingSession = existingSessions[i];
    const newSession = newSessions[i];

    updates.push(
      db
        .update(SessionTable)
        .set({
          sessionDate: newSession.sessionDate,
          startTime: newSession.startTime,
          endTime: newSession.endTime,
          vehicleId: newSession.vehicleId,
          sessionNumber: newSession.sessionNumber,
          updatedAt: new Date(),
        })
        .where(eq(SessionTable.id, existingSession.id))
    );
  }

  // Create new sessions if we need more
  if (newSessions.length > existingSessions.length) {
    const sessionsToCreate = newSessions.slice(existingSessions.length);
    creates.push(
      db.insert(SessionTable).values(
        sessionsToCreate.map((session) => ({
          ...session,
          clientId,
          branchId,
          createdBy: userId,
          status: 'SCHEDULED' as const,
        }))
      )
    );
  }

  // Delete excess sessions if we need fewer
  if (existingSessions.length > newSessions.length) {
    const sessionsToDelete = existingSessions.slice(newSessions.length);
    for (const session of sessionsToDelete) {
      deletes.push(db.delete(SessionTable).where(eq(SessionTable.id, session.id)));
    }
  }

  // Execute all operations
  await Promise.all([...updates, ...creates, ...deletes]);

  return {
    updated: updates.length,
    created:
      newSessions.length > existingSessions.length
        ? newSessions.length - existingSessions.length
        : 0,
    deleted:
      existingSessions.length > newSessions.length
        ? existingSessions.length - newSessions.length
        : 0,
  };
};

export type Session = Awaited<ReturnType<typeof getSessions>>[0];
