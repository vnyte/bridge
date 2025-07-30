/**
 * Maharashtra RTO License Fees Constants
 * Last Updated: December 2024
 * Source: Maharashtra Transport Department & Parivahan Portal
 *
 * Update these values when Maharashtra government revises RTO fees
 */

export const MAHARASHTRA_RTO_FEES = {
  // Learning License
  LEARNING_LICENSE: 200,

  // Driving License (Permanent) - First Class
  DRIVING_LICENSE: 450,

  // Additional Class (when adding to existing license)
  ADDITIONAL_CLASS: 1016,

  // Combined Total (Learning + Driving for single class)
  TOTAL_GOVERNMENT_FEES: 650,

  // Additional Services (if needed in future)
  RENEWAL_FEE: 200,
  DUPLICATE_LICENSE: 200,
  TATKAL_CHARGES: 300,
} as const;

/**
 * Calculate license fees based on scenario
 */
export const calculateLicenseFees = (
  licenseClasses: string[] = [],
  hasExistingLearners: boolean = false,
  serviceCharge: number = 0
): { governmentFees: number; total: number; breakdown: string } => {
  let governmentFees = 0;
  let breakdown = '';

  if (licenseClasses.length === 0) {
    return { governmentFees: 0, total: serviceCharge, breakdown: 'No license classes selected' };
  }

  if (hasExistingLearners) {
    // Student already has learners license - only driving license needed
    if (licenseClasses.length === 1) {
      governmentFees = MAHARASHTRA_RTO_FEES.DRIVING_LICENSE;  // ₹450
      breakdown = 'Driving License only (has existing learners)';
    } else {
      // Multiple classes - first class ₹450, additional classes ₹1016 each
      governmentFees = MAHARASHTRA_RTO_FEES.DRIVING_LICENSE + 
                      (MAHARASHTRA_RTO_FEES.ADDITIONAL_CLASS * (licenseClasses.length - 1));
      breakdown = `Driving License (₹450) + ${licenseClasses.length - 1} additional classes (₹1016 each)`;
    }
  } else {
    // New student - needs both learners and driving license
    if (licenseClasses.length === 1) {
      governmentFees = MAHARASHTRA_RTO_FEES.TOTAL_GOVERNMENT_FEES;  // ₹650
      breakdown = 'Learning License (₹200) + Driving License (₹450)';
    } else {
      // Multiple classes - learning ₹200 + driving ₹450 + additional classes ₹1016 each
      governmentFees = MAHARASHTRA_RTO_FEES.TOTAL_GOVERNMENT_FEES + 
                      (MAHARASHTRA_RTO_FEES.ADDITIONAL_CLASS * (licenseClasses.length - 1));
      breakdown = `Learning License (₹200) + Driving License (₹450) + ${licenseClasses.length - 1} additional classes (₹1016 each)`;
    }
  }

  return {
    governmentFees,
    total: governmentFees + serviceCharge,
    breakdown
  };
};

/**
 * Helper function to get total license fees (backward compatibility)
 */
export const getTotalLicenseFees = (serviceCharge: number = 0): number => {
  return MAHARASHTRA_RTO_FEES.TOTAL_GOVERNMENT_FEES + serviceCharge;
};

/**
 * Helper function to format currency
 */
export const formatINR = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN')}`;
};
