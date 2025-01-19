import { z } from "zod";
export declare const signupFormSchema: z.ZodObject<{
    username: z.ZodString;
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    confirmPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}, {
    name: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}>;
