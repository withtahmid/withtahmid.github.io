interface EmailProps {
    recipient: string;
    subject: string;
    html: string;
}
export declare const sendEmail: (prop: EmailProps) => Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo | undefined>;
export {};
