// import { sql } from 'drizzle-orm';
// import { db } from '../index';
// import { clients } from '../schema/client';

// export async function getNextClientCode(organizationId: string): Promise<number> {
//   // Get the max client code for the organization
//   const result = await db
//     .select({
//       maxCode: sql<number>`COALESCE(MAX(${clients.code}), 0)`,
//     })
//     .from(clients)
//     .where(sql`${clients.organizationId} = ${organizationId}`)
//     .execute();

//   // Return the next code (current max + 1)
//   return (result[0]?.maxCode ?? 0) + 1;
// }
