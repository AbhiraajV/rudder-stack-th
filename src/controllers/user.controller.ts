import { Request, Response } from 'express';
import { prisma } from '../../prisma/prisma';

async function generateId() {
  const { nanoid } = await import('nanoid');
  return nanoid(32);
}

type CreateUserBody = {
  name?: string;
  email: string;
};

type GetUserParams = {
  id: string;
};

type VerifyOtp = {
    email:string,
    code:string,
}

export const registerUser = async (req: Request<{},{},CreateUserBody>, res: Response) => {
  const { name, email } = req.body;
  if (!email) return res.status(400).json({ error: 'email is required' });

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ error: 'User already exists' });

  const user = await prisma.user.create({ data: { name, email } });
  return res.status(201).json({ id: user.id, name: user.name, email: user.email });
};


export const requestOtp = async (req: Request<{},{},CreateUserBody>, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await prisma.otp.create({
    data: {
      email,
      code: otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    },
  });

  // Send email here

  console.log(`OTP for ${email}: ${otp}`);

  return res.status(200).json({ message: 'OTP sent to email',otp });
};


export const verifyOtp = async (req: Request<{},{},VerifyOtp>, res: Response) => {
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ error: 'Email and OTP required' });

  const otpRecord = await prisma.otp.findFirst({
    where: {
      email,
      code,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!otpRecord) return res.status(401).json({ error: 'Invalid or expired OTP' });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const key = await generateId();
  const apiKey = await prisma.apiKey.create({
    data: {
      key,
      userId: user.id,
    },
  });
  await prisma.otp.delete({ where: { id: otpRecord.id } });
  return res.status(200).json({ apiKey: apiKey.key });
};

export const getUserById = async (
  req: Request<GetUserParams>,
  res: Response
) => {
  const { id } = req.params;
  const user = await prisma.user.findFirst({
    where: {
        id
    }
  })
  return res.status(200).json(user);
};

export const getApiKeys = async (req: Request, res: Response) => {
  const apiKey = req.headers['x-api-key'] as string;
  if (!apiKey) return res.status(401).json({ error: 'API key missing' });

  const keyRecord = await prisma.apiKey.findUnique({
    where: { key: apiKey },
    include: { user: true }
  });

  if (!keyRecord) return res.status(401).json({ error: 'Invalid API key' });

  const keys = await prisma.apiKey.findMany({
    where: { userId: keyRecord.userId }
  });

  return res.status(200).json({ keys });
};
