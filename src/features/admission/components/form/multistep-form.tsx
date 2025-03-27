'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { admissionFormSchema, AdmissionFormValues } from '../../types';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useStepNavigation } from '../progress-bar';
import { PersonalInfoStep } from './steps/personal-info';
import { LicenseStep } from './steps/license';
import { PlanStep } from './steps/plan';
import { ScrollArea } from '@/components/ui/scroll-area';

export const MultistepForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<AdmissionFormValues>({
    resolver: zodResolver(admissionFormSchema),
    defaultValues: {
      personalInfo: {
        firstName: '',
        lastName: '',
        phoneNumber: '',
        isCurrentAddressSameAsPermanentAddress: false,
        branchId: '', // This should be populated from available branches
      },
      learningLicense: {
        licenseNumber: '',
        issueDate: new Date(),
        expiryDate: new Date(),
      },
      drivingLicense: {
        licenseNumber: '',
        issueDate: new Date(),
        expiryDate: new Date(),
      },
      plan: {
        vehicleId: '',
        numberOfSessions: 10,
        sessionDurationInMinutes: 60,
        joiningDate: new Date(),
      },
    },
    mode: 'onChange',
  });

  const { handleSubmit, trigger } = methods;
  const { currentStep, goToNext, goToPrevious, isFirstStep, isLastStep } = useStepNavigation(true);

  // Map step keys to components
  const stepComponents: Record<string, React.ReactNode> = {
    personal: <PersonalInfoStep />,
    license: <LicenseStep />,
    plan: <PlanStep />,
  };

  // Map step keys to validation fields
  const stepValidationFields: Record<string, (keyof AdmissionFormValues)[]> = {
    personal: ['personalInfo'],
    license: ['learningLicense', 'drivingLicense'],
    plan: ['plan'],
  };

  // Handle form submission
  const onSubmit: SubmitHandler<AdmissionFormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      // TODO: Add API call to save admission data
      console.log('Form submitted with data:', data);

      toast.success('Admission completed successfully');
      setTimeout(() => {
        router.refresh();
        router.push('/dashboard'); // Redirect to dashboard or another appropriate page
      }, 1000);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to complete admission');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle next step navigation with validation
  const handleNext = async () => {
    const fieldsToValidate = stepValidationFields[currentStep];
    const isStepValid = await trigger(fieldsToValidate);

    if (isStepValid) {
      if (isLastStep) {
        handleSubmit(onSubmit)();
      } else {
        goToNext();
      }
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="h-full flex flex-col py-10">
        {/* Form content - scrollable area */}
        <ScrollArea className="h-[calc(100vh-240px)] pr-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pb-24">
            {stepComponents[currentStep]}
          </form>
        </ScrollArea>

        {/* Navigation buttons - fixed at the bottom */}
        <div className="flex-none bg-white py-4 px-6 border-t flex justify-between">
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
