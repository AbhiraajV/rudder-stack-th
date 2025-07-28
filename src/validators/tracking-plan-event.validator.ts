import { z } from 'zod';

export const createTrackingPlanEventSchema = z.object({
  trackingPlanId: z.string().cuid(),
  eventId: z.string().cuid(),
  additionalProperties: z.boolean().optional(),
});

export const updateTrackingPlanEventSchema = createTrackingPlanEventSchema.partial();

export type CreateTrackingPlanEventInput = z.infer<typeof createTrackingPlanEventSchema>;
export type UpdateTrackingPlanEventInput = z.infer<typeof updateTrackingPlanEventSchema>;
