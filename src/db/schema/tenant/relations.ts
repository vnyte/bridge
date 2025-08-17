import { relations } from 'drizzle-orm';
import { BranchTable } from '../branches/columns';
import { TenantTable } from './columns';

export const schoolRelations = relations(TenantTable, ({ many }) => ({
  branches: many(BranchTable),
}));
