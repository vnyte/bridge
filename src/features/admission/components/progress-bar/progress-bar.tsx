'use client';

import { useCallback, useEffect, useMemo } from 'react';
import { useQueryState } from 'nuqs';
import { atom, useAtom } from 'jotai';
import { cn } from '@/lib/utils';
import { parseAsStringLiteral } from 'nuqs';
import { Chevron } from './chevron';

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
    <div className="flex justify-center gap-4 mb-8">
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
              'relative h-12 w-48 flex items-center justify-center text-sm font-medium transition-colors',
              interactive ? 'cursor-pointer' : 'cursor-default'
            )}
          >
            <Chevron
              className="absolute inset-0 w-full h-full"
              fillClass={cn(
                isActive ? 'fill-primary' : isPast ? 'fill-primary/20' : 'fill-gray-200'
              )}
            />
            <span className={cn('relative z-10', isActive ? 'text-white' : 'text-gray-900')}>
              {step.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
