import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '../dtos/users-dto';
import { User } from '../interfaces/users-interface';
import userService from '../services/users-service';

export default class UsersController {
  private userService = new userService();

  async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const findAllUsersData: User[] = await this.userService.findAllUser();
      res.status(200)
        .json({ data: findAllUsersData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userId: number = Number(req.params.id);

    try {
      const findOneUserData: User = await this.userService.findUserById(userId);
      res.status(200)
        .json({ data: findOneUserData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  }

  async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userData: CreateUserDto = req.body;

    try {
      const createUserData: User = await this.userService.createUser(userData);
      res.status(201)
        .json({ data: createUserData, message: 'created' });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userId: number = Number(req.params.id);
    const userData: User = req.body;

    try {
      const updateUserData: User[] = await this.userService.updateUser(userId, userData);
      res.status(200)
        .json({ data: updateUserData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userId : number = Number(req.params.id);

    try {
      const deleteUserData: User[] = await this.userService.deleteUser(userId);
      res.status(200)
        .json({ data: deleteUserData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  }
}
