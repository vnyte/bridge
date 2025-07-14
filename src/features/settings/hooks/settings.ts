'use client';

import { getBranchSettings } from '../server/actions';
import useSWR from 'swr';

export function useBranchSettings(branchId: string) {
  const response = useSWR(
    branchId ? ['branch-settings', branchId] : null,
    () => getBranchSettings(branchId),
    {
      revalidateOnMount: true,
    }
  );

  return {
    ...response,
    data: response.data?.success ? response.data.data : undefined,
    error: response.error || (!response.data?.success ? response.data?.error : undefined),
  };
}
