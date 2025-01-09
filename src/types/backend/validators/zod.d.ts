import { z } from "zod";
export declare const usernameSchema: z.ZodString;
export declare const nameSchema: z.ZodString;
export declare const emailSchema: z.ZodString;
export declare const passwordSchema: z.ZodString;
export declare const LoginSchema: z.ZodObject<{
    emailOrUsername: z.ZodUnion<[z.ZodString, z.ZodString]>;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    password: string;
    emailOrUsername: string;
}, {
    password: string;
    emailOrUsername: string;
}>;
export declare const signupFormSchema: z.ZodObject<{
    username: z.ZodString;
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    username: string;
    email: string;
    password: string;
}, {
    name: string;
    username: string;
    email: string;
    password: string;
}>;
export declare const parseZodError: (check: any) => any;
export declare const authJWTSchema: z.ZodObject<{
    _id: z.ZodString;
    userType: z.ZodEnum<["admin", "regular", "premium"]>;
}, "strip", z.ZodTypeAny, {
    _id: string;
    userType: "regular" | "admin" | "premium";
}, {
    _id: string;
    userType: "regular" | "admin" | "premium";
}>;
export declare const JWTSchema: z.ZodString;
