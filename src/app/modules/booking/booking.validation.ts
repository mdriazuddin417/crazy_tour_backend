import { z } from 'zod';
import { PAYMENT_STATUS } from '../payment/payment.interface';

export const createBookingSchema = z.object({
  tourListingId: z.string().min(1), // this is the id of the tour listing that the tourist is booking
  requestedDate: z.string(),
  groupSize: z.number().min(1),
  notes: z.string().optional(),
  guideId: z.string().min(1), // this is the id of the guide who is hosting the tour
  paymentStatus: z.enum(Object.values(PAYMENT_STATUS) as [string, ...string[]]).optional().default(PAYMENT_STATUS.UNPAID),
  touristId: z.string().min(1),
});