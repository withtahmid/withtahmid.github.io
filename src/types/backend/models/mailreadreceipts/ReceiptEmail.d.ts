import { Document, Schema, Types } from "mongoose";
interface InvokeSchema {
    time: number;
    browser: string;
}
export interface ReceiptEmailSchema {
    _id: string;
    label: string;
    createTime: number;
    invokes: InvokeSchema[];
    newInvokeCount: number;
}
export interface ReceiptEmailModel extends Omit<ReceiptEmailSchema, "_id">, Document {
    _id: Types.ObjectId;
    user_id: Types.ObjectId;
}
declare const ReceiptEmail: import("mongoose").Model<ReceiptEmailModel, {}, {}, {}, Document<unknown, {}, ReceiptEmailModel> & ReceiptEmailModel & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, Schema<ReceiptEmailModel, import("mongoose").Model<ReceiptEmailModel, any, any, any, Document<unknown, any, ReceiptEmailModel> & ReceiptEmailModel & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ReceiptEmailModel, Document<unknown, {}, import("mongoose").FlatRecord<ReceiptEmailModel>> & import("mongoose").FlatRecord<ReceiptEmailModel> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>>;
export default ReceiptEmail;
