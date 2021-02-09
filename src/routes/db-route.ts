import { RequestHandler, Router } from 'express';
import DbController from '../controllers/db-controller';
import { TransactionDto } from '../dtos/transaction-dto';
import Route from '../interfaces/routes-interface';
import validationMiddleware from '../middlewares/validation-middleware';

export default class DbRoute implements Route {
  router = Router();
  dbController = new DbController();
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
    [
      { method: 'put', path: '/update', handler: this.dbController.update },
      { method: 'delete', path: '/update', handler: this.dbController.remove },
      { method: 'post', path: '/select', handler: this.dbController.select },
      { method: 'post', path: '/exists', handler: this.dbController.exists },
      { method: 'delete', path: '/empty', handler: this.dbController.empty }
    ].forEach((route) => {
      this.createRoute(route.method, route.path, route.handler);
    });
  }
}
