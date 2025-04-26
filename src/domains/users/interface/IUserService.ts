import {Types} from "mongoose";
import type {UserPasswordUpdateSubmit} from "../schema/UserPasswordUpdateSubmitSchema.js";

export default interface IUserService {
    updateUserPassword(params: {
        authUserID: Types.ObjectId | string,
        userID: Types.ObjectId | string,
        data: UserPasswordUpdateSubmit
    }): void;
}