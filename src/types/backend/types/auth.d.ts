import { UserType } from "../models/User";
export interface JWT_User {
    _id: string;
    userType: UserType;
}
