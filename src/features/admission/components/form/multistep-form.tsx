'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
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
import { createSessions } from '@/server/actions/sessions';
import { generateSessionsFromPlan } from '@/lib/sessions';
import { PaymentContainer } from './steps/payment';

type MultistepFormProps = {
  branchConfig: {
    workingDays: number[];
    operatingHours: { start: string; end: string };
  };
};

export const MultistepForm = ({ branchConfig }: MultistepFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      let learningResult: Awaited<ActionReturnType> | null = null;
      let drivingResult: Awaited<ActionReturnType> | null = null;

      // Handle learning license if present
      if (hasLearningLicense) {
        learningResult = await createLearningLicense({
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
        drivingResult = await createDrivingLicense({
          ...drivingLicense,
          class: learningLicense?.class || [],
          clientId,
        });

        // If driving license fails, return its error
        if (drivingResult.error) {
          return drivingResult;
        }
      }

      // Return success message based on what was processed
      if (learningResult && drivingResult) {
        return {
          error: false,
          message: 'Learning and driving license information saved successfully',
        };
      } else if (learningResult) {
        return {
          error: false,
          message: 'Learning license information saved successfully',
        };
      } else if (drivingResult) {
        return {
          error: false,
          message: 'Driving license information saved successfully',
        };
      }

      // If no licenses were processed, allow progression (licenses are optional)
      return {
        error: false,
        message: 'License step completed',
      };
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

    // Check slot availability before creating the plan
    try {
      const { getSessions } = await import('@/server/actions/sessions');
      const sessions = await getSessions(data.vehicleId);

      const selectedDate = data.joiningDate.toISOString().split('T')[0]; // YYYY-MM-DD format
      const selectedTime = `${data.joiningDate.getHours().toString().padStart(2, '0')}:${data.joiningDate.getMinutes().toString().padStart(2, '0')}`;

      // Check if the selected slot is already taken
      const conflictSession = sessions.find((session) => {
        const sessionDate = new Date(session.sessionDate).toISOString().split('T')[0];
        const sessionTime = session.startTime.substring(0, 5); // Remove seconds if present
        return sessionDate === selectedDate && sessionTime === selectedTime;
      });

      if (conflictSession) {
        return Promise.resolve({
          error: true,
          message:
            'The selected time slot is not available. Please choose an available time slot from the suggestions above.',
        });
      }
    } catch (error) {
      console.error('Error checking slot availability:', error);
      return Promise.resolve({
        error: true,
        message: 'Unable to verify slot availability. Please try again.',
      });
    }

    const result = await createPlan({
      ...data,
      clientId,
    });

    setPlanId(result.planId);

    try {
      const planData = getValues('plan');
      const planDataObj = {
        joiningDate: planData.joiningDate,
        joiningTime:
          planData.joiningDate.getHours().toString().padStart(2, '0') +
          ':' +
          planData.joiningDate.getMinutes().toString().padStart(2, '0'),
        numberOfSessions: planData.numberOfSessions,
        vehicleId: planData.vehicleId,
      };

      const clientDataObj = {
        id: clientId,
        firstName: getValues('personalInfo').firstName,
        lastName: getValues('personalInfo').lastName,
      };

      const sessionsToCreate = generateSessionsFromPlan(planDataObj, clientDataObj, branchConfig);

      // Create sessions in the database
      const sessionsResult = await createSessions(sessionsToCreate);

      if (sessionsResult.error) {
        // Payment was created but sessions failed - log warning but don't fail the flow
        console.error('Sessions creation failed:', sessionsResult.message);
        return {
          error: false,
          message: `Payment created successfully, but some sessions could not be scheduled. Please check the calendar to manually schedule sessions.`,
        };
      }

      return {
        error: false,
        message: `Payment and ${sessionsToCreate.length} sessions created successfully`,
      };
    } catch (error) {
      console.error('Error creating sessions:', error);
      return {
        error: false,
        message:
          'Payment created successfully, but sessions could not be scheduled. Please check the calendar to manually schedule sessions.',
      };
    }
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
      component: <PlanStep branchConfig={branchConfig} currentClientId={undefined} />,
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
      setIsSubmitting(true);
      try {
        // Get the current step's data and action handler
        const stepData = stepComponents[currentStepKey].getData();
        const result = await stepComponents[currentStepKey].onSubmit(stepData);

        // Step 3: Handle the result of the step action
        if (result.error) {
          toast.error(result.message || 'Failed to save information');
        } else {
          // Step 4: On success, show feedback and handle navigation
          toast.success(result.message || 'Information saved successfully', {
            position: 'top-right',
          });

          // If it's the last step, we're done with the form
          if (isLastStep) {
            router.refresh();
            router.push('/dashboard'); // Redirect to dashboard or another appropriate page
          } else {
            // Otherwise, proceed to the next step
            goToNext();
          }
        }
      } catch (error) {
        console.error('Error in step submission:', error);
        toast.error('An unexpected error occurred');
      } finally {
        setIsSubmitting(false);
      }
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
            disabled={isFirstStep || isSubmitting}
          >
            Previous
          </Button>

          <Button
            type="button"
            onClick={handleNext}
            disabled={isSubmitting}
            isLoading={isSubmitting}
          >
            {isLastStep ? 'Submit' : 'Next'}
          </Button>
        </div>
      </div>
    </FormProvider>
  );
};

export default MultistepForm;
