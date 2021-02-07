import { Router } from 'express';
import IndexController from '../controllers/index-controller';
import Route from '../interfaces/routes-interface';

export default class IndexRoute implements Route {
  path = '/';
  router = Router();
  indexController = new IndexController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.indexController.index);
  }
}
