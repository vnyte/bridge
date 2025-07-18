import { sql } from 'drizzle-orm';
import { db } from '../index';
import { ClientTable } from '../schema';

export async function getNextClientCode(tenantId: string): Promise<string> {
  // Get the max client code for the tenant
  const result = await db
    .select({
      maxCode: sql<number>`COALESCE(MAX(CAST(${ClientTable.clientCode} AS INTEGER)), 0)`,
    })
    .from(ClientTable)
    .where(sql`${ClientTable.tenantId} = ${tenantId}`)
    .execute();

  // Return the next code (current max + 1) formatted with leading zeros for numbers < 3 digits
  const nextCodeNumber = (result[0]?.maxCode ?? 0) + 1;
  return nextCodeNumber.toString().padStart(3, '0');
}
