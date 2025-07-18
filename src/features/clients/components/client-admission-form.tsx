'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useForm, FormProvider, Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import {
  PersonalInfoValues,
  PlanValues,
  LearningLicenseValues,
  DrivingLicenseValues,
  PaymentValues,
} from '@/features/admission/types';
import { z } from 'zod';

// Simplified form schema for client editing
const clientFormSchema = z.object({
  personalInfo: z.any(),
  learningLicense: z.any().optional(),
  drivingLicense: z.any().optional(),
  plan: z.any(),
  payment: z.any(),
});

type ClientFormValues = z.infer<typeof clientFormSchema>;
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { PersonalInfoStep } from '@/features/admission/components/form/steps/personal-info';
import { LicenseStep } from '@/features/admission/components/form/steps/license';
import { PlanStep } from '@/features/admission/components/form/steps/plan';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  useStepNavigation,
  ProgressBar,
} from '@/features/admission/components/progress-bar/progress-bar';
import { ActionReturnType } from '@/types/actions';
import {
  updateClient,
  createLearningLicense,
  createDrivingLicense,
  createPlan,
  createPayment,
  updateLearningLicense,
  updateDrivingLicense,
  updatePlan,
  updatePayment,
} from '@/features/admission/server/action';
import { PaymentSummary } from './payment-summary';
import { ClientPaymentContainer } from './client-payment-container';
import { ClientDetail } from '@/server/db/client';
import { parseDate } from '@/lib/date-utils';

type ClientAdmissionFormProps = {
  client: NonNullable<ClientDetail>;
  branchConfig: {
    workingDays: number[];
    operatingHours: { start: string; end: string };
  };
};

export const ClientAdmissionForm = ({ client, branchConfig }: ClientAdmissionFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-populate form with existing client data
  const getDefaultValues = (): ClientFormValues => {
    return {
      personalInfo: {
        firstName: client.firstName,
        middleName: client.middleName || '',
        lastName: client.lastName,
        photoUrl: client.photoUrl || '',
        signatureUrl: client.signatureUrl || '',
        guardianFirstName: client.guardianFirstName || '',
        guardianMiddleName: client.guardianMiddleName || '',
        guardianLastName: client.guardianLastName || '',
        birthDate: client.birthDate,
        bloodGroup: client.bloodGroup,
        gender: client.gender,
        phoneNumber: client.phoneNumber,
        alternativePhoneNumber: client.alternativePhoneNumber || '',
        email: client.email || '',
        address: client.address,
        city: client.city,
        state: client.state,
        pincode: client.pincode,
        isCurrentAddressSameAsPermanentAddress:
          client.isCurrentAddressSameAsPermanentAddress || false,
        permanentAddress: client.permanentAddress,
        permanentCity: client.permanentCity,
        permanentState: client.permanentState,
        permanentPincode: client.permanentPincode,
        citizenStatus: client.citizenStatus || 'BIRTH',
        branchId: client.branchId,
        tenantId: client.tenantId,
      },
      learningLicense: client.learningLicense
        ? {
            class: client.learningLicense.class || [],
            licenseNumber: client.learningLicense.licenseNumber || '',
            issueDate: client.learningLicense.issueDate || undefined,
            expiryDate: client.learningLicense.expiryDate || undefined,
          }
        : {},
      drivingLicense: client.drivingLicense
        ? {
            licenseNumber: client.drivingLicense.licenseNumber || '',
            issueDate: client.drivingLicense.issueDate || undefined,
            expiryDate: client.drivingLicense.expiryDate || undefined,
            appointmentDate: client.drivingLicense.appointmentDate || undefined,
          }
        : {},
      plan: {
        vehicleId: client.plan?.[0]?.vehicleId || '',
        numberOfSessions: client.plan?.[0]?.numberOfSessions || 21,
        sessionDurationInMinutes: client.plan?.[0]?.sessionDurationInMinutes || 30,
        joiningDate: (() => {
          const plan = client.plan?.[0];
          if (plan?.joiningDate && plan?.joiningTime) {
            // Parse date using utility function (handles all formats)
            const savedDate = parseDate(plan.joiningDate);
            if (savedDate) {
              const [hours, minutes] = plan.joiningTime.split(':').map(Number);

              // Create combined date with time components
              const combinedDate = new Date(
                savedDate.getFullYear(),
                savedDate.getMonth(),
                savedDate.getDate(),
                hours,
                minutes,
                0,
                0
              );
              return combinedDate;
            }
          }
          return new Date();
        })(),
      },
      payment: {
        discount: client.payments?.[0]?.discount || 0,
      },
    };
  };

  const methods = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: getDefaultValues(),
    mode: 'onChange',
  });

  const { trigger, getValues } = methods;
  const { currentStep, goToNext, goToPrevious, isFirstStep, isLastStep } = useStepNavigation(true);

  // Check if payment is processed and should be read-only
  const isPaymentProcessed =
    client.payments?.[0]?.paymentStatus === 'FULLY_PAID' ||
    client.payments?.[0]?.paymentStatus === 'PARTIALLY_PAID';
  const isPaymentStep = currentStep === 'payment';
  const shouldDisablePaymentEdit = isPaymentStep && isPaymentProcessed;

  // Helper function to generate field paths from type
  const generateFieldPaths = (
    prefix: keyof ClientFormValues,
    excludeFields: string[] = []
  ): Path<ClientFormValues>[] => {
    const value = getValues(prefix);
    const fields = value ? Object.keys(value) : [];

    return fields
      .filter((field) => !excludeFields.includes(field))
      .map((field) => `${String(prefix)}.${field}` as Path<ClientFormValues>);
  };

  // Define step actions for updates
  const handlePersonalStep = async (data: PersonalInfoValues): ActionReturnType => {
    console.log('Updating personal info:', data);
    const result = await updateClient(client.id, data);
    return result;
  };

  const handleLicenseStep = async (data: {
    learningLicense?: LearningLicenseValues;
    drivingLicense?: DrivingLicenseValues;
  }): ActionReturnType => {
    console.log('Processing license info:', JSON.stringify(data, null, 2));

    const { learningLicense, drivingLicense } = data;
    const hasLearningLicense = learningLicense && Object.keys(learningLicense).length > 0;
    const hasDrivingLicense = drivingLicense && Object.keys(drivingLicense).length > 0;

    try {
      let learningResult: Awaited<ActionReturnType> | null = null;
      let drivingResult: Awaited<ActionReturnType> | null = null;

      // Handle learning license
      if (hasLearningLicense) {
        if (client.learningLicense) {
          learningResult = await updateLearningLicense(client.learningLicense.id, {
            ...learningLicense,
            clientId: client.id,
          });
        } else {
          learningResult = await createLearningLicense({
            ...learningLicense,
            clientId: client.id,
          });
        }

        if (learningResult.error) {
          return learningResult;
        }
      }

      // Handle driving license
      const hasClass = learningLicense?.class && learningLicense.class.length > 0;
      if (hasDrivingLicense || hasClass) {
        if (client.drivingLicense) {
          drivingResult = await updateDrivingLicense(client.drivingLicense.id, {
            ...drivingLicense,
            class: learningLicense?.class || [],
            clientId: client.id,
          });
        } else {
          drivingResult = await createDrivingLicense({
            ...drivingLicense,
            class: learningLicense?.class || [],
            clientId: client.id,
          });
        }

        if (drivingResult.error) {
          return drivingResult;
        }
      }

      return {
        error: false,
        message: 'License information updated successfully',
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
    try {
      let result;

      if (client.plan?.[0]) {
        result = await updatePlan(client.plan[0].id, {
          ...data,
          clientId: client.id,
        });
      } else {
        result = await createPlan({
          ...data,
          clientId: client.id,
        });
      }

      return result;
    } catch (error) {
      console.error('Error updating plan:', error);
      return Promise.resolve({
        error: true,
        message: 'Unable to update plan. Please try again.',
      });
    }
  };

  const handlePaymentStep = async (data: PaymentValues): ActionReturnType => {
    console.log('Client-side payment data being submitted:', JSON.stringify(data, null, 2));

    // If payment is already processed, don't allow updates
    if (isPaymentProcessed) {
      return Promise.resolve({
        error: true,
        message: 'Payment has already been processed and cannot be modified.',
      });
    }

    try {
      let result;
      const planId = client.plan?.[0]?.id;

      if (!planId) {
        return Promise.resolve({
          error: true,
          message: 'Plan not found. Please complete the plan step first.',
        });
      }

      if (client.payments?.[0]) {
        result = await updatePayment(client.payments[0].id, {
          ...data,
          clientId: client.id,
          planId,
        });
      } else {
        result = await createPayment({
          ...data,
          clientId: client.id,
          planId,
        });
      }

      return result;
    } catch (error) {
      console.error('Error updating payment:', error);
      return Promise.resolve({
        error: true,
        message: 'Unable to update payment. Please try again.',
      });
    }
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
      component: <PlanStep branchConfig={branchConfig} currentClientId={client.id} />,
      onSubmit: (data: unknown) => handlePlanStep(data as PlanValues),
      getData: () => getValues('plan'),
    },
    payment: {
      component: isPaymentProcessed ? (
        client.payments?.[0] ? (
          <PaymentSummary
            payment={{
              ...client.payments[0],
              paymentStatus: client.payments[0].paymentStatus || 'PENDING',
              paymentType: client.payments[0].paymentType || 'FULL_PAYMENT',
              fullPaymentDate: client.payments[0].fullPaymentDate
                ? new Date(client.payments[0].fullPaymentDate)
                : null,
              firstInstallmentDate: client.payments[0].firstInstallmentDate
                ? new Date(client.payments[0].firstInstallmentDate)
                : null,
              secondInstallmentDate: client.payments[0].secondInstallmentDate
                ? new Date(client.payments[0].secondInstallmentDate)
                : null,
              paymentDueDate: client.payments[0].paymentDueDate
                ? new Date(client.payments[0].paymentDueDate)
                : null,
              fullPaymentPaid: client.payments[0].fullPaymentPaid || false,
              firstInstallmentPaid: client.payments[0].firstInstallmentPaid || false,
              secondInstallmentPaid: client.payments[0].secondInstallmentPaid || false,
            }}
          />
        ) : (
          <ClientPaymentContainer existingPayment={client.payments?.[0] || null} />
        )
      ) : (
        <ClientPaymentContainer existingPayment={client.payments?.[0] || null} />
      ),
      onSubmit: (data: unknown) => handlePaymentStep(data as PaymentValues),
      getData: () => getValues('payment'),
    },
  } as const;

  type StepKey = keyof typeof stepComponents;

  const getStepValidationFields = (step: StepKey): Path<ClientFormValues>[] => {
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

  const handleNext = async () => {
    try {
      const currentStepKey = currentStep as StepKey;
      const fieldsToValidate = getStepValidationFields(currentStepKey);

      const isStepValid = await trigger(fieldsToValidate);

      if (!isStepValid) {
        return;
      }

      setIsSubmitting(true);
      try {
        const stepData = stepComponents[currentStepKey].getData();
        const result = await stepComponents[currentStepKey].onSubmit(stepData);

        if (result.error) {
          toast.error(result.message || 'Failed to save information');
        } else {
          toast.success(result.message || 'Information saved successfully', {
            position: 'top-right',
          });

          // Refresh page data for plan and payment steps to get updated data
          if (currentStepKey === 'plan' || currentStepKey === 'payment') {
            router.refresh();
          }

          if (isLastStep) {
            router.push('/clients');
          } else {
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
      console.error(`Error in step ${currentStep}:`, error);
      toast.error('An error occurred while processing your information');
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="h-full flex flex-col py-2 gap-4">
        {/* Progress Bar */}
        <ProgressBar interactive={true} />

        <ScrollArea className="h-[calc(100vh-400px)] pr-10">
          <form className="space-y-8 pb-24">
            {stepComponents[currentStep as StepKey].component}
          </form>
        </ScrollArea>

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
            disabled={isSubmitting || shouldDisablePaymentEdit}
            isLoading={isSubmitting}
          >
            {shouldDisablePaymentEdit ? 'Payment Processed' : isLastStep ? 'Save Changes' : 'Next'}
          </Button>
        </div>
      </div>
    </FormProvider>
  );
};
