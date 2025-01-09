import { UserModelSchema } from "../models/User";
import { JWT_User } from "../types/auth";
export declare const generateToken: (user: UserModelSchema) => string;
export declare const authenticateToken: (token: string) => (JWT_User | null);
