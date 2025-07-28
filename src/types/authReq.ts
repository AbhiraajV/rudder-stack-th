import { Request } from 'express';

export type AuthRequest<
  Params = Record<string, any>,
  ResBody = any,
  ReqBody = any,
  ReqQuery = any
> = Request<Params, ResBody, ReqBody, ReqQuery> & {
  user?: { id: string };
};
