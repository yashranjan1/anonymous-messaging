import { z } from 'zod';

export const usernameValidation = z.string()
    .min(3, { message: 'Username must be at least 3 characters' })
    .max(20, { message: 'Username must be less than 20 characters' })
    .regex(/^[a-zA-Z0-9]+$/, { message: 'Username can only contain letters and numbers' });

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({ message: 'Invalid email' }),
    password: z.string()
        .min(6, { message: 'Password must be at least 6 characters' })
        .max(128, { message: 'Password must be less than 128 characters' })
});
