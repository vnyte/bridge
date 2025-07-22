import { db } from '@/db';
import { StaffTable } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

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

export const deleteStaff = async (id: string, branchId: string) => {
  try {
    const [staff] = await db
      .update(StaffTable)
      .set({ deletedAt: new Date() })
      .where(and(eq(StaffTable.id, id), eq(StaffTable.branchId, branchId)))
      .returning();

    return staff;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
