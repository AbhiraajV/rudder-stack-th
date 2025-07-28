import { EventType, PropertyType } from '@prisma/client';
import { z } from 'zod';

export const createTrackingPlanSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export const updateTrackingPlanSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),

});
export const createTrackingPlanByObjectSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  events: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      type: z.enum(['track', 'identify', 'alias', 'screen', 'page']).optional(),
      additionalProperties: z.boolean(),
      properties: z.array(
        z.object({
          name: z.string(),
          type: z.enum(['string', 'number', 'boolean']),
          description: z.string(),
          required: z.boolean(),
        })
      ),
    })
  ),
});
