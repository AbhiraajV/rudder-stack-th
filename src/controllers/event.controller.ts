import { Request, Response } from 'express';
import { Event, Prisma } from '@prisma/client';
import { prisma } from '../../prisma/prisma';
import { AuthRequest } from '../types/authReq';
type EventDetails = Pick<Event,'description' | 'name' | 'type'>
export const createEvent = async (req: AuthRequest<{},{},EventDetails>, res: Response) => {
  const { name, type, description } = req.body;
  const userId = req.user?.id;

  if (!name || !type || !userId || !description) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const event = await prisma.event.create({
      data: {
        name,
        type,
        description,
        userId,
      },
    });
    return res.status(201).json(event);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch events', details: (error as Prisma.PrismaClientInitializationError).message });
  }
};
export const getAllEvents = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  try {
    const events = await prisma.event.findMany({
      where: { userId },
    });
    return res.json(events);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch events', details: error });
  }
};

export const getEventById = async (req: AuthRequest<{id:string}>, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  try {
    const event = await prisma.event.findFirst({
      where: { id, userId },
    });
    if (!event) return res.status(404).json({ error: 'Event not found' });
    return res.json(event);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve event', details: error });
  }
};

export const updateEvent = async (req: AuthRequest<{id:string},{},EventDetails>, res: Response) => {
  const { id } = req.params;
  const { name, type, description } = req.body;
  const userId = req.user?.id;

  try {
    const existing = await prisma.event.findFirst({ where: { id, userId } });
    if (!existing) return res.status(404).json({ error: 'Event not found' });

    const updated = await prisma.event.update({
      where: { id },
      data: { name, type, description },
    });
    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update event', details: error });
  }
};
export const deleteEvent = async (req: AuthRequest<{id:string}>, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  try {
    const existing = await prisma.event.findFirst({ where: { id, userId } });
    if (!existing) return res.status(404).json({ error: 'Event not found' });

    await prisma.event.delete({ where: { id } });
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete event', details: error });
  }
};