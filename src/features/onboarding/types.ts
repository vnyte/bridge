import { z } from 'zod';

// Form schema for validation
export const formSchema = z.object({
  schoolName: z.string().min(2, 'School name must be at least 2 characters'),
  branches: z
    .array(z.string().min(2, 'Branch name must be at least 2 characters'))
    .min(1, 'At least one branch is required'),
});

// Type for our form values
export type FormValues = z.infer<typeof formSchema>;

// Type for branch field
export interface BranchField {
  id: number;
  value: string;
}

// Define the step configuration with components
export type StepKey = 'schoolName' | 'branches';
