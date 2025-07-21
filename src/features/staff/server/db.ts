import { db } from '@/db';
import { StaffTable } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const addStaff = async (data: typeof StaffTable.$inferInsert) => {
  const [staff] = await db.insert(StaffTable).values(data).returning();

  return staff;
};

export const updateStaff = async (id: string, data: typeof StaffTable.$inferInsert) => {
  try {
    const [staff] = await db.update(StaffTable).set(data).where(eq(StaffTable.id, id)).returning();

    return staff;
  } catch (error) {
    console.log(error);
  }
};
