import { z } from 'zod';
import { PAYMENT_STATUS } from '../payment/payment.interface';

export const createPaymentZodSchema = z.object({
  bookingId: z.string().min(1),
  amount: z.number().positive(),
  paymentMethod: z.string().min(2)
});

export const updatePaymentStatusZodSchema = z.object({
  status: z.enum(Object.values(PAYMENT_STATUS) as [string, ...string[]]),
  transactionId: z.string().optional(),
  sslTransactionId: z.string().optional()
});