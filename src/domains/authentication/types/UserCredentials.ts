import {Types} from "mongoose";

export type UserCredentials = {
    user: Types.ObjectId | string,
    name: string,
    email: string,
    isAdmin: boolean,
    token: string,
}