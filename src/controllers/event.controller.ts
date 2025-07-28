import {  Request, Response } from 'express';
import {  EventType, Prisma } from '@prisma/client';
import { prisma } from '../../prisma/prisma';
import { EventDetails, eventSchema, updateEventSchema } from '../validators/event.validator';

export const createEvent = async (req: Request<{}, {}, EventDetails>, res: Response) => {
  const parsed = eventSchema.safeParse(req.body);
  const userId = req.user?.id;

  if (!parsed.success || !userId) {
    return res.status(400).json({ error: "Invalid input", details: parsed.error?.format?.() || "Missing userId" });
  }

  const { name, type, description } = parsed.data;

  try {
    const event = await prisma.event.create({
      data: { name, type, description, userId },
    });
    return res.status(201).json(event);
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return res.status(409).json({ error: 'Event with the same name and type already exists' });
      }
    }
    return res.status(500).json({ error: 'Failed to create event', details: error.message });
  }
};

export const getAllEvents = async (req: Request, res: Response) => {
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

export const getEventById = async (req: Request<{ id: string }>, res: Response) => {
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

export const updateEvent = async (req: Request<{ id: string }, {}, Partial<EventDetails>>, res: Response) => {
  const { id } = req.params;
  const parsed = updateEventSchema.safeParse(req.body);
  const userId = req.user?.id;

  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input", details: parsed.error.format() });
  }

  try {
    const existing = await prisma.event.findFirst({ where: { id, userId } });
    if (!existing) return res.status(404).json({ error: 'Event not found' });

    const updated = await prisma.event.update({
      where: { id },
      data: parsed.data,
    });
    return res.json(updated);
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return res.status(409).json({ error: 'Duplicate event name and type' });
    }
    return res.status(500).json({ error: 'Failed to update event', details: error.message });
  }
};

export const deleteEvent = async (req: Request<{ id: string }>, res: Response) => {
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