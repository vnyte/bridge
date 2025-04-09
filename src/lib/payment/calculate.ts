/**
 * Utility functions for payment calculations
 * Used by both frontend and backend to ensure consistent calculations
 */

import { PaymentTypeEnum } from '@/db/schema/payment/columns';

export type PaymentCalculationInput = {
  sessions: number;
  duration: number;
  rate: number;
  discount: number;
  paymentType: (typeof PaymentTypeEnum.enumValues)[number];
};

export type PaymentCalculationResult = {
  originalAmount: number;
  discount: number;
  finalAmount: number;
  firstInstallmentAmount: number;
  secondInstallmentAmount: number;
};

/**
 * Calculate payment amounts based on plan and vehicle data
 */
export function calculatePaymentAmounts({
  sessions,
  duration,
  rate,
  discount,
  paymentType,
}: PaymentCalculationInput): PaymentCalculationResult {
  // Ensure all values are numbers and positive
  const safeSessionCount = Math.max(0, Number(sessions) || 0);
  const safeDuration = Math.max(0, Number(duration) || 0);
  const safeRate = Math.max(0, Number(rate) || 0);
  const safeDiscount = Math.max(0, Number(discount) || 0);

  // Calculate half-hour blocks, rounding up
  const halfHourBlocks = Math.ceil(safeDuration / 30);

  // Calculate original amount
  const originalAmount = safeSessionCount * halfHourBlocks * safeRate;

  // Calculate final amount after discount
  const finalAmount = Math.max(0, originalAmount - safeDiscount);

  // Calculate installment amounts if applicable
  let firstInstallmentAmount = 0;
  let secondInstallmentAmount = 0;

  if (paymentType === 'INSTALLMENTS') {
    firstInstallmentAmount = Math.ceil(finalAmount / 2);
    secondInstallmentAmount = finalAmount - firstInstallmentAmount;
  }

  return {
    originalAmount,
    discount: safeDiscount,
    finalAmount,
    firstInstallmentAmount,
    secondInstallmentAmount,
  };
}

/**
 * Format a number as currency (INR)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
