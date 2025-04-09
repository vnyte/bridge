import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import { X } from 'lucide-react';
import { PaymentCheckboxProps } from './types';
import { AdmissionFormValues } from '@/features/admission/types';
import { useFormContext } from 'react-hook-form';
import { useEffect } from 'react';

export const PaymentOptions = ({
  paymentCheckboxes,
  setPaymentCheckboxes,
}: PaymentCheckboxProps) => {
  const { control, setValue } = useFormContext<AdmissionFormValues>();

  // Initialize payment type to FULL_PAYMENT if no other type is selected
  useEffect(() => {
    // If neither installments nor later is checked, ensure payment type is FULL_PAYMENT
    if (!paymentCheckboxes.installments.isChecked && !paymentCheckboxes.later.isChecked) {
      setValue('payment.paymentType', 'FULL_PAYMENT');
    }
  }, [paymentCheckboxes.installments.isChecked, paymentCheckboxes.later.isChecked, setValue]);

  const handleCheckboxChange = (
    info: keyof typeof paymentCheckboxes,
    checked: boolean | 'indeterminate'
  ) => {
    setPaymentCheckboxes((prev) => {
      // Handle mutual exclusivity between payment types
      if (info === 'later' && checked === true) {
        // Update form value for payment type
        setValue('payment.paymentType', 'PAY_LATER');

        return {
          ...prev,
          later: { ...prev.later, isChecked: true },
          installments: { ...prev.installments, isChecked: false },
        };
      }

      if (info === 'installments' && checked === true) {
        // Update form value for payment type
        setValue('payment.paymentType', 'INSTALLMENTS');

        return {
          ...prev,
          installments: { ...prev.installments, isChecked: true },
          later: { ...prev.later, isChecked: false },
        };
      }

      // If both installments and later are unchecked, set to FULL_PAYMENT
      if (info === 'installments' && checked === false && !prev.later.isChecked) {
        setValue('payment.paymentType', 'FULL_PAYMENT');
      }

      if (info === 'later' && checked === false && !prev.installments.isChecked) {
        setValue('payment.paymentType', 'FULL_PAYMENT');
      }

      // For other checkboxes or unchecking
      return {
        ...prev,
        [info]: {
          ...prev[info],
          isChecked: checked === true,
        },
      };
    });
  };

  const handleDiscountChange = (value: string) => {
    setPaymentCheckboxes((prev) => ({
      ...prev,
      discount: {
        ...prev.discount,
        value,
      },
    }));
  };

  const clearDiscount = () => {
    setPaymentCheckboxes((prev) => ({
      ...prev,
      discount: {
        ...prev.discount,
        value: '',
      },
    }));
  };

  const handleDateChange = (key: 'installments' | 'later', date: Date | null) => {
    setPaymentCheckboxes((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        date,
      },
    }));
  };

  return (
    <>
      <div className="flex gap-10 col-span-9">
        {/* Discount checkbox */}
        <FormItem className="flex items-center gap-3">
          <FormControl>
            <Checkbox
              checked={paymentCheckboxes.discount.isChecked}
              onCheckedChange={(checked) => handleCheckboxChange('discount', checked)}
            />
          </FormControl>
          <FormLabel className="cursor-pointer">{paymentCheckboxes.discount.label}</FormLabel>
        </FormItem>

        {/* Installments checkbox */}
        <FormItem className="flex items-center gap-3">
          <FormControl>
            <Checkbox
              checked={paymentCheckboxes.installments.isChecked}
              onCheckedChange={(checked) => handleCheckboxChange('installments', checked)}
              disabled={paymentCheckboxes.later.isChecked}
            />
          </FormControl>
          <FormLabel className="cursor-pointer">{paymentCheckboxes.installments.label}</FormLabel>
        </FormItem>

        {/* Pay Later checkbox */}
        <FormItem className="flex items-center gap-3">
          <FormControl>
            <Checkbox
              checked={paymentCheckboxes.later.isChecked}
              onCheckedChange={(checked) => handleCheckboxChange('later', checked)}
              disabled={paymentCheckboxes.installments.isChecked}
            />
          </FormControl>
          <FormLabel className="cursor-pointer">{paymentCheckboxes.later.label}</FormLabel>
        </FormItem>
      </div>

      {paymentCheckboxes.discount.isChecked && (
        <div className="col-span-5 col-start-4 pt-5">
          <FormField
            control={control}
            name="payment.discount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount Amount</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      placeholder="Enter discount amount"
                      {...field}
                      onChange={(e) => {
                        field.onChange(Number(e.target.value) ?? 0);
                        handleDiscountChange(e.target.value);
                      }}
                      className="h-12 pr-10" // Added right padding for the X icon
                    />
                  </FormControl>
                  <FormMessage />
                  {field.value !== 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        field.onChange(0);
                        clearDiscount();
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                      aria-label="Clear discount"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </FormItem>
            )}
          />
        </div>
      )}

      {paymentCheckboxes.later.isChecked && (
        <div className="col-span-5 col-start-4 pt-5">
          <FormField
            control={control}
            name="payment.paymentDueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expected Payment Date</FormLabel>
                <FormControl>
                  <DatePicker
                    selected={field.value ? new Date(field.value) : null}
                    onChange={(date) => {
                      field.onChange(date ? new Date(date).toISOString() : null);
                      handleDateChange('later', date);
                    }}
                    className="h-12" // Increased height
                    minDate={new Date()}
                    maxDate={new Date(2100, 0, 1)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}

      {paymentCheckboxes.installments.isChecked && (
        <div className="col-span-5 col-start-4 pt-5">
          <FormField
            control={control}
            name="payment.secondInstallmentDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expected Date for 2nd Installment</FormLabel>
                <FormControl>
                  <DatePicker
                    selected={field.value ? new Date(field.value) : null}
                    onChange={(date) => {
                      field.onChange(date ? new Date(date).toISOString() : null);
                      handleDateChange('installments', date);
                    }}
                    className="h-12" // Increased height
                    minDate={new Date()}
                    maxDate={new Date(2100, 0, 1)} // Allow future dates for expiry
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </>
  );
};
