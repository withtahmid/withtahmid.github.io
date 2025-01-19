import { ReceiptEmailSchema } from "../../../models/mailreadreceipts/ReceiptEmail";
export interface MailReadReceiptsCreateEmailResponse {
    email: ReceiptEmailSchema;
}
export interface MailReadReceiptsDeleteEmailResponse {
}
export interface MailReadReceiptsSeeEmailResponse {
}
export interface MailReadReceiptsFetchAllResponse {
    emails: ReceiptEmailSchema[];
}
