
import { EventType } from "@prisma/client";
import { z } from "zod";
export type EventDetails = z.infer<typeof eventSchema>;


export const eventSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(EventType), 
  description: z.string().min(1, "Description is required"),
});
export const updateEventSchema = eventSchema.partial();
