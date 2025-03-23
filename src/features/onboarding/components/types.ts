import { z } from 'zod';

// Define the branch schema first
const branchSchema = z.object({
  name: z.string().min(2, 'Branch name must be at least 2 characters'),
});

// Form schema for validation
export const onboardingFormSchema = z.object({
  schoolName: z.string().min(2, 'School name must be at least 2 characters'),
  branches: z.array(branchSchema).min(1, 'At least one branch is required'),
});

// Type for our form values
export type OnboardingFormValues = z.infer<typeof onboardingFormSchema>;

// Type for branch field in the UI
export type BranchField = {
  id: number;
  value: string;
};

// Define the step configuration with components
export type StepKey = 'schoolName' | 'branches';
