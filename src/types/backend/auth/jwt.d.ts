import { UserModelSchema } from "../models/User";
import { CTX_User } from "../types/trpc";
export declare const generateToken: (user: UserModelSchema) => string;
export declare const authenticateToken: (token: string) => (CTX_User | null);
