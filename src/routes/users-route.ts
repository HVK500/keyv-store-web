import { Router } from 'express';
import UsersController from '../controllers/users-controller';
import { CreateUserDto } from '../dtos/users-dto';
import Route from '../interfaces/routes-interface';
import validationMiddleware from '../middlewares/validation-middleware';

export default class UsersRoute implements Route {
  path = '/users';
  router = Router();
  usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.usersController.getUsers);
    this.router.get(`${this.path}/:id(\\d+)`, this.usersController.getUserById);
    this.router.post(`${this.path}`, validationMiddleware(CreateUserDto), this.usersController.createUser);
    this.router.put(`${this.path}/:id(\\d+)`, validationMiddleware(CreateUserDto, true), this.usersController.updateUser);
    this.router.delete(`${this.path}/:id(\\d+)`, this.usersController.deleteUser);
  }
}
