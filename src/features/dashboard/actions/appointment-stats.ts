'use server';

import { getAppointmentStatistics } from '@/server/db/appointments';

export async function getAppointmentStatsAction() {
  return await getAppointmentStatistics();
}
