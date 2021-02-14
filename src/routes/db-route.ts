import { RequestHandler, Router } from 'express';
import DbController from '../controllers/db-controller';
import { TransactionDto } from '../dtos/transaction-dto';
import Route from '../interfaces/routes-interface';
import validationMiddleware from '../middlewares/validation-middleware';

export default class DbRoute implements Route {
  router = Router();
  private readonly base = '/db';

  constructor() {
    this.initializeRoutes();
  }

  private createRoute(method: string, path: string, handler: RequestHandler): void {
    this.router[method as 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head'](
      `${this.base}${path}`,
      validationMiddleware(TransactionDto),
      handler
    );
  }

  private initializeRoutes(): void {
    const dbController = new DbController();
    [
      { method: 'put', path: '/update', handler: dbController.update },
      { method: 'delete', path: '/update', handler: dbController.remove },
      { method: 'post', path: '/select', handler: dbController.select },
      { method: 'post', path: '/exists', handler: dbController.exists },
      { method: 'delete', path: '/empty', handler: dbController.empty }
    ].forEach((route) => {
      this.createRoute(route.method, route.path, route.handler);
    });
  }
}
