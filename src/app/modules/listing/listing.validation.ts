import { z } from 'zod';

export const createTourSchema = z.object({
  title: z.string().min(3),
  guideId: z.string(),
  description: z.string().min(10),
  category: z.enum(['FOOD', 'HISTORY', 'ART', 'ADVENTURE', 'NIGHTLIFE', 'SHOPPING', 'PHOTOGRAPHY', 'CULTURE']),
  city: z.string(),
  country: z.string().optional(),
  price: z.number().nonnegative(),
  duration: z.number().positive(),
  maxGroupSize: z.number().min(1),
  meetingPoint: z.string(),
  itinerary: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  isActive: z.boolean().optional()
});

export const updateTourSchema = createTourSchema.partial();