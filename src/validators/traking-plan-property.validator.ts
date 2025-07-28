import { z } from 'zod';

export const AddTPEPValidator = z.object({
  trackingPlanEventId: z.string().cuid(),
  propertyId: z.string().cuid(),
  required: z.boolean().default(false),
});

export const UpdateTPEPValidator = z.object({
  required: z.boolean(),
});
