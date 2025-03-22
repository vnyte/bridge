import { relations } from 'drizzle-orm';
import { branches } from './columns';
import { schools } from '../schools/columns';

export const branchesRelations = relations(branches, ({ one }) => ({
  school: one(schools, {
    fields: [branches.schoolId],
    references: [schools.id],
  }),
}));
