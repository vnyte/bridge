'use client';

import { useCallback, useEffect, useMemo } from 'react';
import { useQueryState } from 'nuqs';
import { atom, useAtom } from 'jotai';
import { cn } from '@/lib/utils';
import { parseAsStringLiteral } from 'nuqs';

// Define the possible steps
export type StepKey = 'personal' | 'license' | 'plan' | 'payment';

// Define the step configuration
export type StepConfig = {
  key: StepKey;
  label: string;
  description?: string;
};

// Define the steps
export const STEPS: StepConfig[] = [
  { key: 'personal', label: 'Personal Info' },
  { key: 'license', label: 'License' },
  { key: 'plan', label: 'Plan' },
  { key: 'payment', label: 'Payment' },
];

// Create a jotai atom for internal state
const currentStepAtom = atom<StepKey>('personal');

// Define the props for the ProgressBar component
export type ProgressBarProps = {
  interactive?: boolean;
};

const sortOrder = STEPS.map((step) => step.key);

// Utility hook to get the current step
export const useCurrentStep = (interactive = true) => {
  const [internalStep, setInternalStep] = useAtom(currentStepAtom);
  const [externalStep, setExternalStep] = useQueryState(
    'step',
    parseAsStringLiteral(sortOrder).withDefault('personal').withOptions({ shallow: !interactive })
  );

  useEffect(() => {
    if (interactive) {
      setInternalStep(externalStep);
    }
  }, [externalStep, interactive, setInternalStep]);

  return {
    currentStep: internalStep,
    setStep: setInternalStep,
    setExternalStep,
  };
};

// Utility hook for step navigation
export const useStepNavigation = (interactive = true) => {
  const { currentStep, setStep, setExternalStep } = useCurrentStep(interactive);

  const currentIndex = useMemo(() => {
    return STEPS.findIndex((step) => step.key === currentStep);
  }, [currentStep]);

  const goToStep = useCallback(
    (stepKey: StepKey) => {
      setStep(stepKey);
      if (interactive) {
        setExternalStep(stepKey);
      }
    },
    [interactive, setExternalStep, setStep]
  );

  const goToNext = useCallback(() => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < STEPS.length) {
      const nextStep = STEPS[nextIndex].key;
      goToStep(nextStep);
    }
  }, [currentIndex, goToStep]);

  const goToPrevious = useCallback(() => {
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      const prevStep = STEPS[prevIndex].key;
      goToStep(prevStep);
    }
  }, [currentIndex, goToStep]);

  return {
    currentStep,
    currentIndex,
    goToStep,
    goToNext,
    goToPrevious,
    isFirstStep: currentIndex === 0,
    isLastStep: currentIndex === STEPS.length - 1,
  };
};

export const ProgressBar = ({ interactive = true }: ProgressBarProps) => {
  const { currentStep, goToStep } = useStepNavigation(interactive);

  return (
    <div className="flex justify-center gap-10">
      {STEPS.map((step, index) => {
        const isActive = step.key === currentStep;
        const isPast = STEPS.findIndex((s) => s.key === currentStep) >= index;

        return (
          <button
            key={step.key}
            type="button"
            onClick={() => interactive && goToStep(step.key)}
            disabled={!interactive}
            className={cn(
              'w-40 h-13 rounded-md flex items-center justify-center text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary text-white'
                : isPast
                  ? 'bg-primary/20 text-primary'
                  : 'bg-gray-200 text-gray-500',
              interactive ? 'cursor-pointer' : 'cursor-default'
            )}
          >
            {step.label}
          </button>
        );
      })}
    </div>
  );
};
