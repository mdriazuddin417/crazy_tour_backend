import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { AuthService } from './auth.service';

export const AuthController = {
  register: catchAsync(async (req: Request, res: Response) => {
    const data = await AuthService.register(req.body);
    return sendResponse(res, { statusCode: 201, success: true, message: 'Registered', data });
  }),

  login: catchAsync(async (req: Request, res: Response) => {
    const data = await AuthService.login(req.body);
    return sendResponse(res, { statusCode: 200, success: true, message: 'Logged in', data });
  })
};