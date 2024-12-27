import type {ZUser} from "../../users/schema/UserSchema.js";
import {Types} from "mongoose";

export interface IAuthRegisterData {
    name: string,
    email: string,
    password: string,
    confirm: string
}

export interface IAuthRegisterService {
    register(params: IAuthRegisterData): Promise<ZUser>;
    toggleAdmin(params: {userID: Types.ObjectId | string}): Promise<ZUser>;
}