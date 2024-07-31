import { z } from 'zod';

export const forgottenPasswordSchema = z.object({
  email: z.string().email({
    message: 'Enter a valid email address',
  }),
});
