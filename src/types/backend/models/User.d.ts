import { Document, Schema, Types } from "mongoose";
export type VerificationType = "account-recovery" | "account-verification" | "nothing";
export interface AccountVerificationUtilSchema {
    verificationType: VerificationType;
    verificationCode: string;
    expiresAt: number;
}
export type UserType = "admin" | "regular" | "premium";
export interface UserSchema {
    _id: string;
    email: string;
    name: string;
    username: string;
    userType: UserType;
}
export interface UserModelSchema extends Omit<UserSchema, "_id">, Document {
    _id: Types.ObjectId;
    password: string;
    verificationUtil: AccountVerificationUtilSchema;
    isVerified: boolean;
}
declare const User: import("mongoose").Model<UserModelSchema, {}, {}, {}, Document<unknown, {}, UserModelSchema> & UserModelSchema & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, Schema<UserModelSchema, import("mongoose").Model<UserModelSchema, any, any, any, Document<unknown, any, UserModelSchema> & UserModelSchema & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, UserModelSchema, Document<unknown, {}, import("mongoose").FlatRecord<UserModelSchema>> & import("mongoose").FlatRecord<UserModelSchema> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>>;
export default User;
