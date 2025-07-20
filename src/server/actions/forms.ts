'use server';

import { getClients, getClient } from '@/server/db/client';

export const getClientsForForms = async () => {
  return getClients();
};

export const getClientForForm = async (clientId: string) => {
  return getClient(clientId);
};