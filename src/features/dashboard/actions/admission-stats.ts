'use server';

import { getAdmissionStatistics } from '@/server/db/client';

export async function getAdmissionStatsAction(months: number) {
  return await getAdmissionStatistics(months);
}
