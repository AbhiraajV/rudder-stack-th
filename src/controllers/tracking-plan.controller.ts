import { Request, Response } from 'express';
import { prisma } from '../../prisma/prisma';
import { z } from 'zod';
import { createTrackingPlanSchema, updateTrackingPlanSchema, createTrackingPlanByObjectSchema} from '../validators/trackingplan.validator';

type TrackingPlanBody = z.infer<typeof createTrackingPlanSchema>;
type TrackingPlanCreatorObjectType = z.infer<typeof createTrackingPlanByObjectSchema>;
export const createTrackingPlan = async (
  req: Request<{}, {}, TrackingPlanBody>,
  res: Response
) => {
  const userId = req.user.id;
  const parse = createTrackingPlanSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: parse.error.format() });
  }

  const { name } = parse.data;

  try {
    const existing = await prisma.trackingPlan.findFirst({ where: { name, userId } });
    if (existing) {
      return res.status(409).json({ error: 'Tracking Plan with this name already exists.' });
    }

    const trackingPlan = await prisma.trackingPlan.create({
      data: {
        name,
        userId,
      },
    });

    return res.status(201).json(trackingPlan);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create tracking plan', details: err });
  }
};
export const getAllTrackingPlans = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  try {
    const plans = await prisma.trackingPlan.findMany({
      where: { userId },
    });

    return res.json(plans);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch tracking plans', details: err });
  }
};

export const getTrackingPlanById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const { id } = req.params;
  const userId = req.user?.id;

  try {
    const plan = await prisma.trackingPlan.findFirst({
      where: { id, userId },
    });

    if (!plan) {
      return res.status(404).json({ error: 'Tracking Plan not found' });
    }

    return res.json(plan);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve tracking plan', details: err });
  }
};

export const updateTrackingPlan = async (
  req: Request<{ id: string }, {}, TrackingPlanBody>,
  res: Response
) => {
  const { id } = req.params;
  const userId = req.user?.id;

  const parse = updateTrackingPlanSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: parse.error.format() });
  }

  try {
    const existing = await prisma.trackingPlan.findFirst({ where: { id, userId } });

    if (!existing) {
      return res.status(404).json({ error: 'Tracking Plan not found' });
    }

    const updated = await prisma.trackingPlan.update({
      where: { id },
      data: parse.data.description ? { name: parse.data.name,description:parse.data.description } : {name:parse.data.name},
    });

    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update tracking plan', details: err });
  }
};

export const deleteTrackingPlan = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const { id } = req.params;
  const userId = req.user?.id;

  try {
    const existing = await prisma.trackingPlan.findFirst({ where: { id, userId } });

    if (!existing) {
      return res.status(404).json({ error: 'Tracking Plan not found' });
    }

    await prisma.trackingPlan.delete({ where: { id } });

    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete tracking plan', details: err });
  }
};

export const createTrackingPlanByObject = async (
  req: Request<{}, {}, TrackingPlanCreatorObjectType>,
  res: Response
) => {
  const userId = req.user.id;

  const parse = createTrackingPlanByObjectSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: parse.error.format() });
  }

  const { data } = parse;

  try {
    const result = await prisma.$transaction(async (tx) => {
      let trackingPlan = await tx.trackingPlan.upsert({
        where: {
          name_userId: {
            name: data.name,
            userId,
          },
        },
        update:{},
        create: {
          name: data.name,
          description: data.description,
          userId,
        },
      });


      for (const eventInput of data.events) {
        const existingEvent = await tx.event.findFirst({
          where: {
            name: eventInput.name,
            type: eventInput.type ?? undefined,
            userId,
          },
        });

        let eventId: string;

        if (existingEvent) {
          if (existingEvent.description !== eventInput.description) {
            throw new Error(
              `Event "${eventInput.name}" already exists with a different description.`
            );
          }
          eventId = existingEvent.id;
        } else {
          const newEvent = await tx.event.create({
            data: {
              name: eventInput.name,
              type: eventInput.type ?? 'track',
              description: eventInput.description,
              userId,
            },
          });
          eventId = newEvent.id;
        }

        const trackingPlanEvent = await tx.trackingPlanEvent.create({
          data: {
            trackingPlanId: trackingPlan.id,
            eventId,
            additionalProperties: eventInput.additionalProperties,
          },
        });

        for (const propertyInput of eventInput.properties) {
          const existingProperty = await tx.property.findFirst({
            where: {
              name: propertyInput.name,
              type: propertyInput.type,
              userId,
            },
          });

          let propertyId: string;

          if (existingProperty) {
            const normalize = (str: string) => str.trim().replace(/\s+/g, " ");
            if (normalize(existingProperty.description) !== normalize(propertyInput.description)) {
              throw new Error(
                `Property "${propertyInput.name}" of type "${propertyInput.type}" already exists with a different description.`
              );
            }

            const conflictingTracking = await tx.trackingPlanEventProperty.findFirst({
              where: {
                propertyId: existingProperty.id,
                required: {
                  not: propertyInput.required,
                },
              },
            });

            if (conflictingTracking) {
              throw new Error(
                `Property "${propertyInput.name}" has conflicting "required" values across events.`
              );
            }
            propertyId = existingProperty.id;
          } else {
            const newProperty = await tx.property.create({
              data: {
                name: propertyInput.name,
                type: propertyInput.type,
                description: propertyInput.description,
                userId,
              },
            });
            propertyId = newProperty.id;
          }

          await tx.trackingPlanEventProperty.create({
            data: {
              trackingPlanEventId: trackingPlanEvent.id,
              propertyId,
              required: propertyInput.required,
            },
          });
        }
      }

      return trackingPlan;
    });

    return res.status(201).json(result);
  } catch (error) {
    console.error('Error creating tracking plan:', error);
    return res.status(409).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
};
