export interface SignupResponse {
}
export interface LoginResponse {
    token: string;
}
export interface IsUsernameAvailableRespone {
    isAvailable: boolean;
}
export interface VerifyAccountResponse {
}
export interface RecoverAccountSentURLResponse {
}
export interface RecoverAccountResponse {
    token: string;
}
export interface checkURLStatusResponse {
    status: "expired" | "invalid" | "valid";
}
