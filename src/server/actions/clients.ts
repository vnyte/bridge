'use server';

import { getClientsWithUnassignedSessions as getClientsWithUnassignedSessionsFromDB } from '@/server/db/client';

export const getClientsWithUnassignedSessions = async (bypassCache = false) => {
  return getClientsWithUnassignedSessionsFromDB(bypassCache);
};
