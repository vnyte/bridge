import { db } from '@/db';
import { ClientTable } from '@/db/schema';
import { CACHE_TAGS, revalidateDbCache } from '@/lib/cache';
import { LearningLicenseTable } from '@/db/schema/learning-licenses/columns';
import { DrivingLicenseTable } from '@/db/schema/driving-licenses/columns';

export const upsertClientInDB = async (data: typeof ClientTable.$inferInsert) => {
  // Create a variable to track if this was an update operation
  let isExistingClient = false;

  // Use onConflictDoUpdate to handle the case where a client with the same phone number already exists
  const [client] = await db
    .insert(ClientTable)
    .values(data)
    .onConflictDoUpdate({
      target: ClientTable.phoneNumber,
      set: {
        ...data,
        updatedAt: new Date(),
      },
    })
    .returning();

  // Check if this was an update by comparing createdAt and updatedAt
  // If they're different by more than a few seconds, it was an update
  if (client.createdAt && client.updatedAt) {
    const timeDiff = Math.abs(client.updatedAt.getTime() - client.createdAt.getTime());
    isExistingClient = timeDiff > 1000; // More than 1 second difference
  }

  revalidateDbCache({
    tag: CACHE_TAGS.clients,
    id: data.branchId,
  });

  return {
    isExistingClient,
    clientId: client.id,
  };
};

export const upsertLearningLicenseInDB = async (data: typeof LearningLicenseTable.$inferInsert) => {
  // Create a variable to track if this was an update operation
  let isExistingLicense = false;

  // Use onConflictDoUpdate to handle the case where a license for this client already exists
  const [license] = await db
    .insert(LearningLicenseTable)
    .values(data)
    .onConflictDoUpdate({
      target: LearningLicenseTable.clientId,
      set: {
        ...data,
        updatedAt: new Date(),
      },
    })
    .returning();

  // Check if this was an update by comparing createdAt and updatedAt
  // If they're different by more than a few seconds, it was an update
  if (license.createdAt && license.updatedAt) {
    const timeDiff = Math.abs(license.updatedAt.getTime() - license.createdAt.getTime());
    isExistingLicense = timeDiff > 1000; // More than 1 second difference
  }

  return {
    license,
    isExistingLicense,
  };
};

export const upsertDrivingLicenseInDB = async (data: typeof DrivingLicenseTable.$inferInsert) => {
  // Create a variable to track if this was an update operation
  let isExistingLicense = false;

  // Use onConflictDoUpdate to handle the case where a license for this client already exists
  const [license] = await db
    .insert(DrivingLicenseTable)
    .values(data)
    .onConflictDoUpdate({
      target: DrivingLicenseTable.clientId,
      set: {
        ...data,
        updatedAt: new Date(),
      },
    })
    .returning();

  // Check if this was an update by comparing createdAt and updatedAt
  // If they're different by more than a few seconds, it was an update
  if (license.createdAt && license.updatedAt) {
    const timeDiff = Math.abs(license.updatedAt.getTime() - license.createdAt.getTime());
    isExistingLicense = timeDiff > 1000; // More than 1 second difference
  }

  return {
    license,
    isExistingLicense,
  };
};
