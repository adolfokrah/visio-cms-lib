import { z } from 'zod';

export const updateProfileDetailsSchema = z.object({
  firstName: z.string().min(2, {
    message: 'First name must be at least 2 characters.',
  }),
  lastName: z.string().min(2, {
    message: 'Last name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Enter a valid email address',
  }),
  role: z.string().min(2),
  oldPassword: z.string().optional(),
  password: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value) return true; // Skip validation if password is not provided
        return value.length >= 8;
      },
      {
        message: 'Password must be at least 8 characters long.',
      },
    )
    .refine(
      (value) => {
        if (!value) return true; // Skip validation if password is not provided
        return /[A-Z]/.test(value);
      },
      {
        message: 'Password must contain at least one uppercase letter.',
      },
    )
    .refine(
      (value) => {
        if (!value) return true; // Skip validation if password is not provided
        return /[a-z]/.test(value);
      },
      {
        message: 'Password must contain at least one lowercase letter.',
      },
    )
    .refine(
      (value) => {
        if (!value) return true; // Skip validation if password is not provided
        return /[0-9]/.test(value);
      },
      {
        message: 'Password must contain at least one digit.',
      },
    )
    .refine(
      (value) => {
        if (!value) return true; // Skip validation if password is not provided
        return /[\W_]/.test(value);
      },
      {
        message: 'Password must contain at least one special character.',
      },
    ),
});
