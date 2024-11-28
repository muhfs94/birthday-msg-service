import { z } from 'zod';

export const createUserSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be less than 50 characters'),
  birthday: z
    .string()
    .min(1, 'Birthday is required')
    .refine((val) => !isNaN(Date.parse(val)), 'Invalid date format'),
  location: z
    .string()
    .min(1, 'Location is required')
    .max(200, 'Location must be less than 200 characters'),
});

export const updateUserSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  birthday: z
    .string()
    .min(1)
    .refine((val) => !isNaN(Date.parse(val)))
    .optional(),
  location: z.string().min(1).max(200).optional(),
});
