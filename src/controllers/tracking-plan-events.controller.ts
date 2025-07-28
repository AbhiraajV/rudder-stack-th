import { Request, Response } from 'express';
import { createTrackingPlanEventSchema, updateTrackingPlanEventSchema } from '../validators/tracking-plan-event.validator';
import { prisma } from '../../prisma/prisma';

export const createTrackingPlanEvent = async (req: Request, res: Response) => {
  const parse = createTrackingPlanEventSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: parse.error.flatten() });
  }

  const { trackingPlanId, eventId, additionalProperties = false } = parse.data;

  try {
    const result = await prisma.trackingPlanEvent.create({
      data: {
        trackingPlanId,
        eventId,
        additionalProperties,
      },
    });

    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create tracking plan event' });
  }
};
export const getTrackingPlanEvents = async (req: Request, res: Response) => {
  const { trackingPlanId } = req.params;

  try {
    const results = await prisma.trackingPlanEvent.findMany({
      where: {
        trackingPlanId,
      },
      include: {
        event: true,
        trackingPlan: true,
        properties: true,
      },
    });

    return res.json(results);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch tracking plan events' });
  }
};

export const getTrackingPlanEventById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await prisma.trackingPlanEvent.findUnique({
      where: { id },
      include: {
        event: true,
        trackingPlan: true,
        properties: true,
      },
    });

    if (!result) {
      return res.status(404).json({ error: 'Tracking plan event not found' });
    }

    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch tracking plan event' });
  }
};
export const updateTrackingPlanEvent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const parse = updateTrackingPlanEventSchema.safeParse(req.body);

  if (!parse.success) {
    return res.status(400).json({ error: parse.error.flatten() });
  }

  try {
    const updated = await prisma.trackingPlanEvent.update({
      where: { id },
      data: parse.data,
    });

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update tracking plan event' });
  }
};

export const deleteTrackingPlanEvent = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.trackingPlanEvent.delete({ where: { id } });
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete tracking plan event' });
  }
};