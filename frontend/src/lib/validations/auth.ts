import * as z from 'zod';

export const loginSchema = z.object({
    email: z.string().email('invalidEmail'),
    password: z.string().min(8, 'passwordMin'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
