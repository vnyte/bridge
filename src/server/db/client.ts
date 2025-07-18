import { db } from '@/db';
import {
  ClientTable,
  PaymentTable,
  SessionTable,
  LearningLicenseTable,
  DrivingLicenseTable,
  PlanTable,
} from '@/db/schema';
import { auth } from '@clerk/nextjs/server';
import { eq, ilike, and, desc, or, count } from 'drizzle-orm';
import { getCurrentOrganizationBranchId } from '@/server/db/branch';

const _getClients = async (branchId: string, name?: string, paymentStatus?: string) => {
  const conditions = [eq(ClientTable.branchId, branchId)];

  if (name) {
    conditions.push(
      or(ilike(ClientTable.firstName, `%${name}%`), ilike(ClientTable.lastName, `%${name}%`))!
    );
  }

  // First, get the basic client information
  const baseQuery = db
    .select({
      id: ClientTable.id,
      firstName: ClientTable.firstName,
      middleName: ClientTable.middleName,
      lastName: ClientTable.lastName,
      phoneNumber: ClientTable.phoneNumber,
      email: ClientTable.email,
      address: ClientTable.address,
      city: ClientTable.city,
      state: ClientTable.state,
      createdAt: ClientTable.createdAt,
      paymentStatus: PaymentTable.paymentStatus,
      hasLearningLicense: LearningLicenseTable.id,
      hasDrivingLicense: DrivingLicenseTable.id,
      hasPlan: PlanTable.id,
      hasPayment: PaymentTable.id,
    })
    .from(ClientTable)
    .leftJoin(PaymentTable, eq(ClientTable.id, PaymentTable.clientId))
    .leftJoin(LearningLicenseTable, eq(ClientTable.id, LearningLicenseTable.clientId))
    .leftJoin(DrivingLicenseTable, eq(ClientTable.id, DrivingLicenseTable.clientId))
    .leftJoin(PlanTable, eq(ClientTable.id, PlanTable.clientId))
    .where(and(...conditions))
    .orderBy(desc(ClientTable.createdAt));

  const clients = await baseQuery;

  // Get session counts for each client
  const clientsWithSessions = await Promise.all(
    clients.map(async (client) => {
      // Count remaining sessions (scheduled or rescheduled)
      const remainingSessions = await db
        .select({ count: count() })
        .from(SessionTable)
        .where(
          and(
            eq(SessionTable.clientId, client.id),
            or(eq(SessionTable.status, 'SCHEDULED'), eq(SessionTable.status, 'RESCHEDULED'))
          )
        );

      const unassignedSessions = await db
        .select({ count: count() })
        .from(SessionTable)
        .where(and(eq(SessionTable.clientId, client.id), eq(SessionTable.status, 'CANCELLED')));

      // Determine completion status
      // A client is complete if they have at least a plan and payment
      // Licenses are optional but plan and payment are required
      const isComplete = !!(client.hasPlan && client.hasPayment);

      return {
        ...client,
        remainingSessions: remainingSessions[0]?.count || 0,
        unassignedSessions: unassignedSessions[0]?.count || 0,
        isComplete,
        completionStatus: isComplete ? ('COMPLETE' as const) : ('INCOMPLETE' as const),
      };
    })
  );

  if (paymentStatus && paymentStatus !== 'ALL') {
    return clientsWithSessions.filter(
      (client) =>
        client.paymentStatus === paymentStatus ||
        (paymentStatus === 'NO_PAYMENT' && !client.paymentStatus)
    );
  }

  return clientsWithSessions;
};

export const getClients = async (name?: string, paymentStatus?: string) => {
  const { userId } = await auth();
  const branchId = await getCurrentOrganizationBranchId();

  if (!userId || !branchId) {
    return [];
  }

  return await _getClients(branchId, name, paymentStatus);
};

const _getClient = async (id: string) => {
  const client = await db.query.ClientTable.findFirst({
    where: eq(ClientTable.id, id),
    with: {
      payments: true,
      learningLicense: true,
      drivingLicense: true,
      plan: {
        with: {
          vehicle: true,
        },
      },
    },
  });

  return client;
};

export const getClient = async (id: string) => {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  return await _getClient(id);
};

const _getClientsWithUnassignedSessions = async (branchId: string) => {
  // Get clients who have cancelled sessions (unassigned sessions)
  const clients = await db
    .select({
      id: ClientTable.id,
      firstName: ClientTable.firstName,
      middleName: ClientTable.middleName,
      lastName: ClientTable.lastName,
      phoneNumber: ClientTable.phoneNumber,
    })
    .from(ClientTable)
    .innerJoin(SessionTable, eq(ClientTable.id, SessionTable.clientId))
    .where(and(eq(ClientTable.branchId, branchId), eq(SessionTable.status, 'CANCELLED')))
    .groupBy(
      ClientTable.id,
      ClientTable.firstName,
      ClientTable.middleName,
      ClientTable.lastName,
      ClientTable.phoneNumber
    );

  return clients.map((client) => ({
    ...client,
    name: `${client.firstName} ${client.middleName ? client.middleName + ' ' : ''}${client.lastName}`,
  }));
};

export const getClientsWithUnassignedSessions = async () => {
  const { userId } = await auth();
  const branchId = await getCurrentOrganizationBranchId();

  if (!userId || !branchId) {
    return [];
  }

  return await _getClientsWithUnassignedSessions(branchId);
};

export type Client = Awaited<ReturnType<typeof getClients>>[0];
export type ClientDetail = Awaited<ReturnType<typeof getClient>>;
export type ClientWithUnassignedSessions = Awaited<
  ReturnType<typeof getClientsWithUnassignedSessions>
>[0];
