import { ErrorResponse, PartialSuccessResponse, SuccessResponse } from "../types/response";
import { AuthErrorCodes } from "./auth";
export declare const ErrorCodes: {
    readonly UNAUTHORIZED: "UNAUTHORIZED";
    readonly FORBIDDEN: "FORBIDDEN";
    readonly INVALID_CREDENTIALS: "INVALID_CREDENTIALS";
    readonly TOKEN_EXPIRED: "TOKEN_EXPIRED";
    readonly TOKEN_INVALID: "TOKEN_INVALID";
    readonly INVALID_INPUT: "INVALID_INPUT";
    readonly RESOURCE_NOT_FOUND: "RESOURCE_NOT_FOUND";
    readonly SERVER_ERROR: "SERVER_ERROR";
    readonly DATABASE_SAVE_FAILED: "DATABASE_SAVE_FAILED";
    readonly DATABASE_QUERY_FAILED: "DATABASE_QUERY_FAILED";
    readonly EMAIL_SEND_FAILED: "EMAIL_SEND_FAILED";
    readonly SCHEMA_VALIDATION_FAILED: "SCHEMA_VALIDATION_FAILED";
};
export type ErrorCode = keyof typeof ErrorCodes;
export declare const ErrorMessages: Record<typeof ErrorCodes[keyof typeof ErrorCodes], string>;
export declare const createSuccessResponse: <T>(data: T, message: string) => SuccessResponse<T>;
type AllErrorCoddes = typeof ErrorCodes[keyof typeof ErrorCodes] | typeof AuthErrorCodes[keyof typeof AuthErrorCodes];
export declare const createPartialSuccessResponse: (errorCode: AllErrorCoddes, message: string) => PartialSuccessResponse;
export declare const createErrorResponse: (error: AllErrorCoddes, message: string) => ErrorResponse;
export {};
