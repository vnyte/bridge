import { z } from 'zod';

export const vehicleFormSchema = z.object({
  name: z.string(),
  number: z.string(),
  pucExpiry: z.string().nullable().optional(),
  insuranceExpiry: z.string().nullable().optional(),
  registrationExpiry: z.string().nullable().optional(),
  rent: z.number(),
});
