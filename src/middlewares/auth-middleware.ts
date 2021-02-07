import { NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import HttpException from '../exceptions/http-exception';
import { DataStoredInToken, RequestWithUser } from '../interfaces/auth-interface';
import usersModel from '../models/users-model';

export default function authMiddleware(req: RequestWithUser, res: Response, next: NextFunction) {
  const cookies = req.cookies;

  if (cookies && cookies.Authorization) {
    const secret = process.env.JWT_SECRET;

    try {
      const verificationResponse = jwt.verify(cookies.Authorization, secret) as DataStoredInToken;
      const userId = verificationResponse.id;
      const findUser = usersModel.find((user) => user.id === userId);

      if (findUser) {
        req.user = findUser;
        next();
      } else {
        next(new HttpException(401, 'Wrong authentication token'));
      }
    } catch (error) {
      next(new HttpException(401, 'Wrong authentication token'));
    }
  } else {
    next(new HttpException(404, 'Authentication token missing'));
  }
}
