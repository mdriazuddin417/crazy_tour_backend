import { z } from 'zod';

export const createBookingSchema = z.object({
  tourListingId: z.string().min(1),
  requestedDate: z.string(),
  groupSize: z.number().min(1),
  notes: z.string().optional()
});