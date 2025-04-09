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
  PlanValues,
  LearningLicenseValues,
  DrivingLicenseValues,
  PaymentValues,
} from '../../types';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { PersonalInfoStep } from './steps/personal-info';
import { LicenseStep } from './steps/license';
import { PlanStep } from './steps/plan';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useStepNavigation } from '../progress-bar/progress-bar';
import { ActionReturnType } from '@/types/actions';
import {
  createClient,
  createLearningLicense,
  createDrivingLicense,
  createPlan,
  createPayment,
} from '../../server/action';
import { PaymentContainer } from './steps/payment';

export const MultistepForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [clientId, setClientId] = React.useState<string | undefined>(undefined);
  const [planId, setPlanId] = React.useState<string | undefined>(undefined);

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
      payment: {
        discount: 0,
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
    console.log('Processing personal info:', data);
    const result = await createClient(data);

    // If the client was created successfully, store the clientId for later steps
    if (!result.error && result.clientId) {
      setClientId(result.clientId);
    }

    return result;
  };

  const handleLicenseStep = async (data: {
    learningLicense?: LearningLicenseValues;
    drivingLicense?: DrivingLicenseValues;
  }): ActionReturnType => {
    console.log('Processing license info:', data);

    if (!clientId) {
      return Promise.resolve({
        error: true,
        message: 'Client ID not found. Please complete the personal information step first.',
      });
    }

    const { learningLicense, drivingLicense } = data;

    const hasClass = learningLicense?.class;
    const hasLearningLicense = learningLicense && Object.keys(learningLicense).length > 0;
    const hasDrivingLicense = drivingLicense && Object.keys(drivingLicense).length > 0;

    try {
      // Handle learning license if present
      if (hasLearningLicense) {
        const learningResult = await createLearningLicense({
          ...learningLicense,
          clientId,
        });

        // If learning license fails, return the learning result
        if (learningResult.error) {
          return learningResult;
        }
      }

      // Handle driving license if present
      if (hasDrivingLicense || hasClass) {
        const drivingResult = await createDrivingLicense({
          ...drivingLicense,
          class: learningLicense?.class || [],
          clientId,
        });

        // If driving license fails, return its error
        if (drivingResult.error) {
          return drivingResult;
        }

        // If both licenses were processed successfully, return a combined success message
        return {
          error: false,
          message: 'Learning and driving license information saved successfully',
        };
      }

      // This should never happen due to our checks above, but TypeScript needs it
      return Promise.resolve({
        error: true,
        message: 'No license data was processed',
      });
    } catch (error) {
      console.error('Error processing license data:', error);
      return Promise.resolve({
        error: true,
        message: 'An unexpected error occurred while processing license data',
      });
    }
  };

  const handlePlanStep = async (data: PlanValues): ActionReturnType => {
    if (!clientId) {
      return Promise.resolve({
        error: true,
        message: 'Client ID not found. Please complete the personal information step first.',
      });
    }

    const result = await createPlan({
      ...data,
      clientId,
    });

    setPlanId(result.planId);

    return result;
  };

  const handlePaymentStep = async (data: PaymentValues): ActionReturnType => {
    if (!clientId) {
      return Promise.resolve({
        error: true,
        message: 'Client ID not found. Please complete the personal information step first.',
      });
    }

    if (!planId) {
      return Promise.resolve({
        error: true,
        message: 'Plan ID not found. Please complete the plan step first.',
      });
    }

    const result = await createPayment({
      ...data,
      clientId,
      planId,
    });

    return result;
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
      onSubmit: (data: unknown) =>
        handleLicenseStep(
          data as { learningLicense?: LearningLicenseValues; drivingLicense?: DrivingLicenseValues }
        ),
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
    payment: {
      component: <PaymentContainer />,
      onSubmit: (data: unknown) => handlePaymentStep(data as PaymentValues),
      getData: () => getValues('payment'),
    },
  } as const;

  // Derive the step key type from the stepComponents object
  type StepKey = keyof typeof stepComponents;

  // Function to get validation fields for a specific step
  const getStepValidationFields = (step: StepKey): Path<AdmissionFormValues>[] => {
    switch (step) {
      case 'personal':
        return generateFieldPaths('personalInfo');
      case 'license':
        return [...generateFieldPaths('learningLicense'), ...generateFieldPaths('drivingLicense')];
      case 'plan':
        return generateFieldPaths('plan');
      case 'payment':
        return generateFieldPaths('payment');
      default:
        return [];
    }
  };

  console.log('Step validation fields:', methods.formState.errors);
  // Handle next step navigation with validation
  const handleNext = async () => {
    try {
      // Step 1: Generate validation fields on demand for the current step
      const currentStepKey = currentStep as StepKey;
      const fieldsToValidate = getStepValidationFields(currentStepKey);

      console.log('Fields to validate:', fieldsToValidate);
      const isStepValid = await trigger(fieldsToValidate);

      if (!isStepValid) {
        // If validation fails, we don't proceed further
        console.log('Validation failed for fields:', fieldsToValidate);
        return;
      }

      // Step 2: Execute the step-specific action
      startTransition(async () => {
        // Get the current step's data and action handler
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
