export declare const sendAccountVerificationEmail: (recipient: string, verificationURL: string) => Promise<{
    message: string;
    error?: undefined;
} | {
    error: string;
    message?: undefined;
}>;
