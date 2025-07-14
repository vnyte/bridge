import { db } from '@/db';
import { SessionTable } from '@/db/schema';
import { auth } from '@clerk/nextjs/server';
import { eq, and, ne } from 'drizzle-orm';
import { getCurrentOrganizationBranchId } from '@/server/db/branch';

const _getSessions = async (branchId: string, vehicleId?: string) => {
  const conditions = [
    eq(SessionTable.branchId, branchId),
    // Exclude cancelled sessions from calendar view
    ne(SessionTable.status, 'CANCELLED'),
  ];

  if (vehicleId) {
    conditions.push(eq(SessionTable.vehicleId, vehicleId));
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

export const getSessions = async (vehicleId?: string) => {
  const { userId } = await auth();
  const branchId = await getCurrentOrganizationBranchId();

  if (!userId || !branchId) {
    return [];
  }

  return await _getSessions(branchId, vehicleId);
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
    status?: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'NO_SHOW' | 'CANCELLED';
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

export type Session = Awaited<ReturnType<typeof getSessions>>[0];
