import { z } from 'zod';
const invalidSlugPattern = /:(\/|$)/;
export const addNewPageFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 8 characters long'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters long')
    .refine((slug) => !invalidSlugPattern.test(slug), {
      message: 'Params should be in this format /:param',
    }),
});
