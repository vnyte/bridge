'use client';

import { getSessions } from '@/server/actions/sessions';
import useSWR from 'swr';

export function useSessions(vehicleId?: string) {
  const response = useSWR(
    vehicleId ? ['sessions', vehicleId] : null,
    () => getSessions(vehicleId),
    {
      revalidateOnMount: true,
    }
  );

  return response;
}
