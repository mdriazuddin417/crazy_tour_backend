import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { UserService } from './user.service';


export const UserController = {
  getProfile: catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const data = await UserService.getProfile(id);
    return sendResponse(res, { statusCode: 200, success: true, message: 'Profile', data });
  }),

  updateProfile: catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const data = await UserService.updateProfile(id, req.body);
    return sendResponse(res, { statusCode: 200, success: true, message: 'Updated', data });
  }),

  getAllUsers: catchAsync(async (req: Request, res: Response) => {
    const data = await UserService.getAllUsers(req.query as Record<string, string>);
    return sendResponse(res, { statusCode: 200, success: true, message: 'Users', data });
  })
};