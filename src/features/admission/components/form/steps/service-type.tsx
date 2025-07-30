'use client';

import { useFormContext } from 'react-hook-form';
import { AdmissionFormValues } from '@/features/admission/types';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { TypographyH4, TypographyP } from '@/components/ui/typography';
import { GraduationCap, Car } from 'lucide-react';

type ServiceTypeStepProps = {
  disabled?: boolean;
};

export const ServiceTypeStep = ({ disabled = false }: ServiceTypeStepProps) => {
  const { control } = useFormContext<AdmissionFormValues>();

  const serviceTypeOptions = [
    {
      value: 'FULL_SERVICE' as const,
      label: 'Full Service Package',
      description: 'We handle your license applications + professional driving training',
      icon: GraduationCap,
      features: [
        'License applications handled by us',
        "Learner's → Driving license process",
        'Professional driving training',
        'Documentation support',
        'End-to-end service',
      ],
    },
    {
      value: 'DRIVING_ONLY' as const,
      label: 'Driving Training Only',
      description: 'Professional driving lessons - we collect license info for our records',
      icon: Car,
      features: [
        'Professional driving lessons',
        'You manage your own license applications',
        'We collect license info for records',
        'Perfect for existing license holders',
        'Flexible training schedule',
      ],
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <TypographyH4>
          {disabled ? 'Selected Service Type' : 'Choose Your Service Type'}
        </TypographyH4>
        <TypographyP className="text-gray-600 max-w-2xl mx-auto">
          {disabled
            ? 'This is the service type selected for this client. This cannot be changed once set.'
            : 'Select the type of service that best fits your needs. This will determine the steps in your admission process.'}
        </TypographyP>
      </div>

      <FormField
        control={control}
        name="personalInfo.serviceType"
        render={({ field }) => (
          <FormItem className="space-y-6">
            <FormControl>
              <RadioGroup
                onValueChange={disabled ? undefined : field.onChange}
                value={field.value}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                disabled={disabled}
              >
                {serviceTypeOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = field.value === option.value;

                  return (
                    <FormItem key={option.value} className="space-y-0">
                      <FormLabel
                        className={disabled ? 'cursor-default h-full' : 'cursor-pointer h-full'}
                      >
                        <div
                          className={`border rounded-lg p-6 transition-all h-full flex flex-col ${
                            isSelected
                              ? `border-primary bg-primary/5 shadow-md ${disabled ? 'opacity-60' : ''}`
                              : `border-gray-200 ${disabled ? 'opacity-40' : 'hover:border-gray-300 hover:shadow-md'}`
                          }`}
                        >
                          <div className="flex items-start space-x-4">
                            <FormControl>
                              <RadioGroupItem
                                value={option.value}
                                className="mt-1"
                                disabled={disabled}
                              />
                            </FormControl>

                            <div className="flex-1 space-y-4">
                              <div className="flex items-center space-x-3">
                                <div
                                  className={`w-12 h-12 px-3 py-3 rounded-full flex items-center justify-center ${
                                    isSelected ? 'bg-primary/20' : 'bg-gray-100'
                                  }`}
                                >
                                  <Icon
                                    className={`w-6 h-6 ${
                                      isSelected ? 'text-primary' : 'text-gray-600'
                                    }`}
                                  />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-lg">{option.label}</h3>
                                  <p className="text-sm text-gray-600">{option.description}</p>
                                </div>
                              </div>

                              <ul className="space-y-2">
                                {option.features.map((feature, index) => (
                                  <li
                                    key={index}
                                    className="flex items-center text-sm text-gray-700"
                                  >
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3 flex-shrink-0" />
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </FormLabel>
                    </FormItem>
                  );
                })}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ServiceTypeStep;
