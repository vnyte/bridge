'use client';

import { Button } from '@/components/ui/button';
import { useTransition } from 'react';
import { useForm, FormProvider, Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import {
  admissionFormSchema,
  AdmissionFormValues,
  PersonalInfoValues,
  LicenseStepValues,
  PlanValues,
} from '../../types';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { PersonalInfoStep } from './steps/personal-info';
import { LicenseStep } from './steps/license';
import { PlanStep } from './steps/plan';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useStepNavigation } from '../progress-bar/progress-bar';
import { ActionReturnType } from '@/types/actions';

export const MultistepForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const methods = useForm<AdmissionFormValues>({
    resolver: zodResolver(admissionFormSchema),
    defaultValues: {
      personalInfo: {
        citizenStatus: 'BIRTH',
        isCurrentAddressSameAsPermanentAddress: false,
      },
      learningLicense: {},
      drivingLicense: {},
      plan: {
        vehicleId: '',
        numberOfSessions: 21,
        sessionDurationInMinutes: 30,
      },
    },
    mode: 'onChange',
  });

  const { trigger, getValues } = methods;
  const { currentStep, goToNext, goToPrevious, isFirstStep, isLastStep } = useStepNavigation(true);

  // Helper function to generate field paths from type
  const generateFieldPaths = (
    prefix: keyof AdmissionFormValues,
    excludeFields: string[] = []
  ): Path<AdmissionFormValues>[] => {
    // Get the value for the specified prefix and safely handle undefined
    const value = getValues(prefix);
    const fields = value ? Object.keys(value) : [];

    return fields
      .filter((field) => !excludeFields.includes(field))
      .map((field) => `${String(prefix)}.${field}` as Path<AdmissionFormValues>);
  };

  // Define step actions
  const handlePersonalStep = async (data: PersonalInfoValues): ActionReturnType => {
    console.log(data);
    // return createClient(data);

    return Promise.resolve({ error: false, message: 'License information saved' });
  };

  const handleLicenseStep = async (data: LicenseStepValues): ActionReturnType => {
    console.log(data);
    // Placeholder for license step action
    return Promise.resolve({ error: false, message: 'License information saved' });
  };

  const handlePlanStep = async (data: PlanValues): ActionReturnType => {
    console.log(data);
    // Placeholder for plan step action
    return Promise.resolve({ error: false, message: 'Plan information saved' });
  };

  // Map step keys to components and their corresponding actions
  const stepComponents = {
    personal: {
      component: <PersonalInfoStep />,
      onSubmit: (data: unknown) => handlePersonalStep(data as PersonalInfoValues),
      getData: () => getValues('personalInfo'),
    },
    license: {
      component: <LicenseStep />,
      onSubmit: (data: unknown) => handleLicenseStep(data as LicenseStepValues),
      getData: () => ({
        learningLicense: getValues('learningLicense'),
        drivingLicense: getValues('drivingLicense'),
      }),
    },
    plan: {
      component: <PlanStep />,
      onSubmit: (data: unknown) => handlePlanStep(data as PlanValues),
      getData: () => getValues('plan'),
    },
  } as const;

  // Derive the step key type from the stepComponents object
  type StepKey = keyof typeof stepComponents;

  // Map step keys to validation fields
  const stepValidationFields: Record<StepKey, Path<AdmissionFormValues>[]> = {
    personal: generateFieldPaths('personalInfo'),
    license: [...generateFieldPaths('learningLicense'), ...generateFieldPaths('drivingLicense')],
    plan: generateFieldPaths('plan'),
  };

  // Handle next step navigation with validation
  const handleNext = async () => {
    try {
      // Step 1: Validate the current step's fields
      const fieldsToValidate = stepValidationFields[currentStep as StepKey];
      const isStepValid = await trigger(fieldsToValidate);

      if (!isStepValid) {
        // If validation fails, we don't proceed further
        console.log('Validation failed for fields:', fieldsToValidate);
        return;
      }

      // Step 2: Execute the step-specific action
      startTransition(async () => {
        // Get the current step's data and action handler
        const currentStepKey = currentStep as StepKey;
        const stepData = stepComponents[currentStepKey].getData();
        const result = await stepComponents[currentStepKey].onSubmit(stepData);

        // Step 3: Handle the result of the step action
        if (result.error) {
          toast.error(result.message || 'Failed to save information');
          return;
        }

        // Step 4: On success, show feedback and handle navigation
        toast.success(result.message || 'Information saved successfully');

        // If it's the last step, we're done with the form
        if (isLastStep) {
          router.refresh();
          router.push('/dashboard'); // Redirect to dashboard or another appropriate page
          return;
        }

        // Otherwise, proceed to the next step
        goToNext();
      });
    } catch (error) {
      // Handle any unexpected errors
      console.error(`Error in step ${currentStep}:`, error);
      toast.error('An error occurred while processing your information');
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="h-full flex flex-col py-10 gap-4">
        {/* Form content - scrollable area */}
        <ScrollArea className="h-[calc(100vh-320px)] pr-10">
          <form className="space-y-8 pb-24">
            {stepComponents[currentStep as StepKey].component}
          </form>
        </ScrollArea>

        {/* Navigation buttons - fixed at the bottom */}
        <div className="bg-white py-4 px-6 border-t flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={goToPrevious}
            disabled={isFirstStep || isPending}
          >
            Previous
          </Button>

          <Button type="button" onClick={handleNext} disabled={isPending} isLoading={isPending}>
            {isLastStep ? 'Submit' : 'Next'}
          </Button>
        </div>
      </div>
    </FormProvider>
  );
};

export default MultistepForm;
