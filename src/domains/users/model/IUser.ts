import {Types} from "mongoose";

export default interface IUser {
    readonly _id: Types.ObjectId | string;
    name: string;
    email: string;
    password: string;
    isAdmin: boolean;
}