import { db } from '@/db';
import { RTOClientTable } from '@/db/schema/rto-clients/columns';
import { sql } from 'drizzle-orm';

/**
 * Generates the next client code for RTO clients within a tenant
 * Format: Sequential numbers with leading zeros (001, 002, 003, etc.)
 * Each tenant has its own sequence starting from 001
 */
export async function getNextRTOClientCode(tenantId: string): Promise<string> {
  // Get the max client code for the tenant
  const result = await db
    .select({
      maxCode: sql<number>`COALESCE(MAX(CAST(${RTOClientTable.clientCode} AS INTEGER)), 0)`,
    })
    .from(RTOClientTable)
    .where(sql`${RTOClientTable.tenantId} = ${tenantId}`)
    .execute();

  // Return the next code (current max + 1) formatted with leading zeros for numbers < 3 digits
  const nextCodeNumber = (result[0]?.maxCode ?? 0) + 1;
  return nextCodeNumber.toString().padStart(3, '0');
}
