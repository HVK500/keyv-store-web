import { NextFunction, Request, Response } from 'express';

export default class IndexController {
  index(req: Request, res: Response, next: NextFunction): void {
    try {
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }
}
