export declare const AuthErrorCodes: {
    readonly EMAIL_ALREADY_EXISTS: "EMAIL_ALREADY_EXISTS";
    readonly USERNAME_ALREADY_TAKEN: "USERNAME_ALREADY_TAKEN";
    readonly PASSWORD_MISMATCH: "PASSWORD_MISMATCH";
    readonly INVALID_CREDENTIALS: "INVALID_CREDENTIALS";
    readonly VERIFICATION_URL_EXPIRED: "VERIFICATION_URL_EXPIRED";
    readonly INVALID_VERIFICATION_URL: "INVALID_VERIFICATION_URL";
    readonly RECOVERY_URL_EXPIRED: "RECOVERY_URL_EXPIRED";
    readonly INVALID_RECOVERY_URL: "INVALID_RECOVERY_URL";
    readonly ACCOUNT_NOT_VERIFIED: "ACCOUNT_NOT_VERIFIED";
};
export type AuthErrorCode = keyof typeof AuthErrorCodes;
export declare const AuthErrorMessages: Record<typeof AuthErrorCodes[keyof typeof AuthErrorCodes], string>;
