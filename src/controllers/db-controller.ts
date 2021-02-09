import { NextFunction, Request, Response } from 'express';
import { TransactionDto } from '../dtos/transaction-dto';
import DbService from '../services/db-service';

export default class DbController {
  private static service = new DbService();

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    const trx: TransactionDto = req.body;

    try {
      await DbController.service.update(trx);
      res.status(204)
        .end();
    } catch (err) {
      next(err);
    }
  }

  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await DbController.service.remove(req.body as TransactionDto);
      res.status(200)
        .end();
    } catch (err) {
      next(err);
    }
  }

  async select(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await DbController.service.select(req.body as TransactionDto);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async exists(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await DbController.service.exists(req.body as TransactionDto);
      res.status(200)
        .send(result);
    } catch (err) {
      next(err);
    }
  }

  async empty(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await DbController.service.empty(req.body as TransactionDto);
      res.status(200)
        .send(result);
    } catch (err) {
      next(err);
    }
  }
}
