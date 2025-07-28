import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../../prisma/prisma';
import { PropertySchema, UpdatePropertySchema } from '../validators/property.validator';
import { Prisma } from '@prisma/client';

export const createProperty = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const body = PropertySchema.parse(req.body);

    const existing = await prisma.property.findUnique({
      where: {
        name_type_userId: {
          name: body.name,
          type: body.type,
          userId,
        },
      },
    });

    if (existing) {
      if (existing.description !== body.description) {
        return res.status(409).json({ message: 'Property with same name and type exists but with different description' });
      }
      return res.status(200).json(existing); // return existing if identical
    }

    const property = await prisma.property.create({
      data: {
        ...body,
        userId,
      },
    });

    return res.status(201).json(property);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientInitializationError) {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateProperty = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;
    const data = UpdatePropertySchema.parse(req.body);

    const property = await prisma.property.updateMany({
      where: { id, userId },
      data,
    });

    if (property.count === 0) return res.status(404).json({ message: 'Property not found' });

    const updated = await prisma.property.findUnique({ where: { id } });
    return res.json(updated);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientInitializationError) {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deleteProperty = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;

    await prisma.property.deleteMany({
      where: { id, userId },
    });

    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const listProperties = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const props = await prisma.property.findMany({
      where: { userId },
    });
    return res.json(props);
  } catch (err) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
