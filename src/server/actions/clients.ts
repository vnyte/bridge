'use server';

import { getClientsWithUnassignedSessions as getClientsWithUnassignedSessionsFromDB } from '@/server/db/client';

export const getClientsWithUnassignedSessions = async () => {
  return getClientsWithUnassignedSessionsFromDB();
};
