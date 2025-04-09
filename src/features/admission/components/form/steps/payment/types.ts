import { Dispatch, SetStateAction } from 'react';

// Define the payment info state type
export const PAYMENT_INFO = {
  discount: {
    label: 'Apply Discount',
    isChecked: false,
    value: '',
  },
  installments: {
    label: 'Pay in Installments',
    isChecked: false,
    date: null as Date | null,
  },
  later: {
    label: 'Pay Later',
    isChecked: false,
    date: null as Date | null,
  },
};

export type PaymentInfoState = typeof PAYMENT_INFO;

export type PaymentCheckboxProps = {
  paymentCheckboxes: PaymentInfoState;
  setPaymentCheckboxes: Dispatch<SetStateAction<PaymentInfoState>>;
};

export type PaymentOverviewProps = {
  discountInfo: { isChecked: boolean; value: string };
  paymentCheckboxes: PaymentInfoState;
};
