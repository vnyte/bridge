import { db } from '@/db';
import { ClientTable } from '@/db/schema';
import { CACHE_TAGS, revalidateDbCache } from '@/lib/cache';

export const createClientInDB = async (data: typeof ClientTable.$inferInsert) => {
  const [client] = await db.insert(ClientTable).values(data).returning();

  revalidateDbCache({
    tag: CACHE_TAGS.clients,
    branchId: data.branchId,
  });

  return client;
};
