import { relations } from 'drizzle-orm';
import { schools } from './columns';
import { branches } from '../branches/columns';

export const schoolRelations = relations(schools, ({ many }) => ({
  branches: many(branches),
}));
