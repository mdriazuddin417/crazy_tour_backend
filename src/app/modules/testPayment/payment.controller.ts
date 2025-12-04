import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { IUser } from '../user/user.interface';
import { PaymentService } from './payment.service';


export const PaymentController = {
  createPaymentSession: catchAsync(async (req: Request, res: Response) => {
    const data = await PaymentService.createPaymentSession(req.body, (req as unknown as { user: IUser }).user as IUser);
    return sendResponse(res, { statusCode: 200, success: true, message: 'Payment session created successfully', data });
  }),

  ipnHandler: catchAsync(async (req: Request, res: Response) => {
    const data = await PaymentService.handleIPN(req.body);
    return sendResponse(res, { statusCode: 200, success: true, message: 'IPN handled successfully', data });
  }),

  payoutToGuide: catchAsync(async (req: Request, res: Response) => {
    const data = await PaymentService.payoutToGuide(req.body.bookingId);
    return sendResponse(res, { statusCode: 200, success: true, message: 'Payout initiated successfully', data });
  })
};