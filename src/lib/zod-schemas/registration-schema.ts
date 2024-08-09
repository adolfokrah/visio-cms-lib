import { z } from 'zod';

export const registrationSchema = z.object({
  firstName: z.string().min(2, {
    message: 'First name must be at least 2 characters.',
  }),
  lastName: z.string().min(2, {
    message: 'Last name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Enter a valid email address',
  }),
  role: z.string(),
  password: z
    .string()
    .min(8, {
      message: 'Password must be at least 8 characters long.',
    })
    .regex(/[A-Z]/, {
      message: 'Password must contain at least one uppercase letter.',
    })
    .regex(/[a-z]/, {
      message: 'Password must contain at least one lowercase letter.',
    })
    .regex(/[0-9]/, {
      message: 'Password must contain at least one digit.',
    })
    .regex(/[\W_]/, {
      message: 'Password must contain at least one special character.',
    }),
});
