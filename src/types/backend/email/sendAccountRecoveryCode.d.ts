import { UserModelSchema } from '../models/User';
export declare const sendAccountRecoveryCode: (user: UserModelSchema) => Promise<{
    message: string;
    error?: undefined;
} | {
    error: string;
    message?: undefined;
}>;
