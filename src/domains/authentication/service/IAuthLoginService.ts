import {Types} from "mongoose";

export interface UserCredentials {
    user: Types.ObjectId | string,
    name: string,
    email: string,
    isAdmin: boolean,
    token: string,
}

export interface IAuthLoginService {
    login(params: {email: string, password: string}): Promise<UserCredentials>;
}