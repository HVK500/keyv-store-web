import { NextFunction, Request, Response } from 'express';

export default function originAppendMiddleware(req: Request, res: Response, next: NextFunction) {
  req.headers.origin = `${req.protocol}://${req.hostname}`;
  next();
}
