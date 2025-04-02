'use client';

import { getVehicles } from '@/server/actions/vehicle';
import useSWR from 'swr';

export function useVehicles() {
  const response = useSWR('vehicles', () => getVehicles(), {
    revalidateOnMount: true,
  });

  return response;
}
