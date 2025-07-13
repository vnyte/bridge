import { db } from '@/db';
import { ClientTable, PaymentTable } from '@/db/schema';
import { dbCache, getBranchTag, CACHE_TAGS } from '@/lib/cache';
import { auth } from '@clerk/nextjs/server';
import { eq, ilike, and, desc, or } from 'drizzle-orm';
import { getCurrentOrganizationBranchId } from '@/server/db/branch';

const _getClients = async (branchId: string, name?: string, paymentStatus?: string) => {
  const conditions = [eq(ClientTable.branchId, branchId)];

  if (name) {
    conditions.push(
      or(
        ilike(ClientTable.firstName, `%${name}%`),
        ilike(ClientTable.lastName, `%${name}%`),
        ilike(ClientTable.phoneNumber, `%${name}%`)
      )!
    );
  }

  const query = db
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
    })
    .from(ClientTable)
    .leftJoin(PaymentTable, eq(ClientTable.id, PaymentTable.clientId))
    .where(and(...conditions))
    .orderBy(desc(ClientTable.createdAt));

  const clients = await query;

  if (paymentStatus && paymentStatus !== 'ALL') {
    return clients.filter(
      (client) =>
        client.paymentStatus === paymentStatus ||
        (paymentStatus === 'NO_PAYMENT' && !client.paymentStatus)
    );
  }

  return clients;
};

export const getClients = async (name?: string, paymentStatus?: string) => {
  const { userId } = await auth();
  const branchId = await getCurrentOrganizationBranchId();

  if (!userId || !branchId) {
    return [];
  }

  const cacheFn = dbCache(_getClients, {
    tags: [getBranchTag(branchId, CACHE_TAGS.clients)],
  });

  return await cacheFn(branchId, name, paymentStatus);
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

  const cacheFn = dbCache(_getClient, {
    tags: [getBranchTag(id, CACHE_TAGS.clients)],
  });

  return await cacheFn(id);
};

export type Client = Awaited<ReturnType<typeof getClients>>[0];
