import { z } from 'zod';

export const vehicleFormSchema = z.object({
  name: z.string().min(1).min(2),
  number: z.string().min(1).min(2),
  pucNumber: z.string().min(1).min(2).optional(),
  insuranceNumber: z.string().min(1).min(2).optional(),
  registrationExpiry: z.string().min(1).min(2).optional(),
  rent: z.number(),
});
