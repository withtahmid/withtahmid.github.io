export interface Response {
    message?: string | undefined;
    error?: string | undefined;
}
export interface LoginResponse extends Response {
    token: string | null;
}
export interface SignupResponse extends Response {
    token: string | null;
}
export interface VerifyAccountResponse extends Response {
    success: boolean;
}
export interface ResendCodeResponse extends Response {
    canResendAt: number;
}
export interface AccountRecoveryCodeSendResponse extends Response {
    canResendAt: number;
    emailSent: string | null;
}
export interface SubmitAccountVerificationCodeResponse extends Response {
    token: string | null;
}
