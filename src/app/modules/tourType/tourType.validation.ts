import { z } from 'zod';

export const createTourTypeZodSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  icon: z.string().url().optional(),
  isActive: z.boolean().optional()
});

export const updateTourTypeZodSchema = createTourTypeZodSchema.partial();