import { Request, Response } from 'express';
import { AddTPEPValidator, UpdateTPEPValidator } from '../validators/traking-plan-property.validator';
import { prisma } from '../../prisma/prisma';
import { Prisma } from '@prisma/client';

export const addTrackingPlanEventProperty = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const data = AddTPEPValidator.parse(req.body);

    // Ensure property belongs to user
    const property = await prisma.property.findUnique({
      where: { id: data.propertyId },
    });

    if (!property || property.userId !== userId) {
      return res.status(404).json({ message: 'Property not found or unauthorized' });
    }

    const exists = await prisma.trackingPlanEventProperty.findUnique({
      where: {
        trackingPlanEventId_propertyId: {
          trackingPlanEventId: data.trackingPlanEventId,
          propertyId: data.propertyId,
        },
      },
    });

    if (exists) return res.status(409).json({ message: 'Property already attached to tracking plan event' });

    const result = await prisma.trackingPlanEventProperty.create({ data });

    return res.status(201).json(result);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientInitializationError) {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateTrackingPlanEventProperty = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;
    const data = UpdateTPEPValidator.parse(req.body);

    // Optional: verify ownership by joining through property/trackingPlanEvent

    const updated = await prisma.trackingPlanEventProperty.update({
      where: { id },
      data,
    });

    return res.json(updated);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientInitializationError) {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deleteTrackingPlanEventProperty = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    await prisma.trackingPlanEventProperty.delete({
      where: { id },
    });

    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};


