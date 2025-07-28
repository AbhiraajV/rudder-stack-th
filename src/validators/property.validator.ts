import { z } from 'zod';

export const PropertySchema = z.object({
  name: z.string().min(1),
  type: z.enum(['string', 'number', 'boolean']),
  description: z.string().min(1),
});

export const UpdatePropertySchema = PropertySchema.partial();
