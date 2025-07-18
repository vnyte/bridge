'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import SchoolNameStep from './steps/school-name';
import BranchesStep from './steps/branches';
import React from 'react';
import { onboardingFormSchema, OnboardingFormValues } from '../types';
import { createTenant } from '../../server/action';
import { toast } from 'sonner';
import { useAuth, useClerk } from '@clerk/nextjs';
import { useOrganizationList } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { CompletionScreen } from '../completion-screen';
import { SuccessScreen } from '../success-screen';

// Define the step configuration with components
export type StepKey = 'schoolName' | 'branches';

interface StepConfig {
  title: string;
  component: React.ComponentType;
  validationFields: Array<keyof OnboardingFormValues>;
}

export const MultistepForm = () => {
  const methods = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingFormSchema),
    defaultValues: {
      schoolName: '',
      branches: [{ name: '' }], // Start with one empty branch
    },
    mode: 'onChange',
  });

  const { handleSubmit, trigger } = methods;

  // Define the steps configuration
  const steps: Record<StepKey, StepConfig> = {
    schoolName: {
      title: 'School Information',
      component: SchoolNameStep,
      validationFields: ['schoolName'],
    },
    branches: {
      title: 'Branch Locations',
      component: BranchesStep,
      validationFields: ['branches'],
    },
  };

  // Define step order
  const stepOrder: StepKey[] = ['schoolName', 'branches'];

  // Current step state
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStepKey = stepOrder[currentStepIndex];
  const currentStep = steps[currentStepKey];
  const [isPending, setIsPending] = useState(false);
  const { getToken } = useAuth();
  const { setActive } = useClerk();
  const { userMemberships } = useOrganizationList();
  const router = useRouter();

  // Completion flow state
  const [showCompletion, setShowCompletion] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Handle form submission
  const onSubmit: SubmitHandler<OnboardingFormValues> = async (data) => {
    setShowCompletion(true);
    setIsPending(true);

    try {
      const response = await createTenant(data);
      if (response?.error) {
        // On error, hide completion and show error
        setShowCompletion(false);
        toast.error(response.message);
      } else {
        // On success, proceed to completion flow
        setShowCompletion(false);
        setShowSuccess(true);
      }
    } catch (error) {
      console.error('Error creating tenant:', error);
      setShowCompletion(false);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsPending(false);
    }
  };

  // Handle completion flow
  const handleCompletionComplete = () => {
    setShowCompletion(false);
    setShowSuccess(true);
  };

  const handleRedirectToDashboard = async () => {
    // Refresh the session to ensure latest metadata is loaded
    await getToken({ skipCache: true });

    // Ensure organization is selected before redirecting
    if (userMemberships.data?.length) {
      await setActive({ organization: userMemberships.data[0].organization.id });
    }

    // Add delay to ensure metadata propagation and organization context is set
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Use Next.js router instead of window.location
    router.push('/dashboard');
  };

  // Handle next step
  const goToNextStep = async () => {
    // Validate only the fields for the current step
    const isStepValid = await trigger(
      currentStep.validationFields as Array<keyof OnboardingFormValues>
    );

    if (isStepValid) {
      if (currentStepIndex < stepOrder.length - 1) {
        // Move to next step
        setCurrentStepIndex(currentStepIndex + 1);
      } else {
        // Submit the form if on the last step
        handleSubmit(onSubmit)();
      }
    }
  };

  // Show completion screen
  if (showCompletion) {
    return <CompletionScreen onComplete={handleCompletionComplete} />;
  }

  // Show success screen
  if (showSuccess) {
    return <SuccessScreen onRedirect={handleRedirectToDashboard} />;
  }

  // Dynamically render the current step component
  const StepComponent = currentStep.component;

  return (
    <FormProvider {...methods}>
      <div className="w-full max-w-4xl mx-auto">
        {/* Progress indicator */}
        <div
          className="absolute top-0 left-0 bg-primary h-2 transition-all duration-300 ease-in-out"
          style={{ width: `${(currentStepIndex / stepOrder.length) * 100}%` }}
        />

        {/* Form content */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <StepComponent />

          {/* Navigation buttons */}
          <div className="flex justify-center gap-4 mt-20">
            <Button
              type="button"
              variant="black"
              size="onboarding"
              onClick={goToNextStep}
              isLoading={isPending}
            >
              {currentStepIndex < stepOrder.length - 1 ? 'Next' : 'Submit'}
            </Button>
          </div>
        </form>
      </div>
    </FormProvider>
  );
};
