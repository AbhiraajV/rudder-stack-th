import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const apiKeyAuth = async (req: Request, res: Response, next: NextFunction) => {
  const key = req.headers['x-api-key'] as string;

  if (!key) {
    return res.status(401).json({ error: 'Missing API key' });
  }

  const apiKey = await prisma.apiKey.findUnique({
    where: { key },
    include: { user: true },
  });

  if (!apiKey || apiKey.revoked) {
    return res.status(403).json({ error: 'Invalid API key' });
  }

  (req as any).user = apiKey.user;
  next();
};
