import type IUserService from "../interface/IUserService.js";
import {Types} from "mongoose";
import {
    type UserPasswordUpdateSubmit,
    UserPasswordUpdateSubmitSchema
} from "../schema/UserPasswordUpdateSubmitSchema.js";
import createHttpError from "http-errors";
import ZodParseError from "../../../shared/errors/ZodParseError.js";
import bcrypt from "bcryptjs";
import User from "../model/User.js";

export default class UserService implements IUserService {
    async updateUserPassword(params: {
        authUserID: Types.ObjectId | string,
        userID: Types.ObjectId | string;
        data: UserPasswordUpdateSubmit
    }) {
        const {authUserID, userID, data} = params;
        if (!authUserID || !userID || authUserID !== userID) throw createHttpError(401, "Unauthorized.");

        const user = await User.findById(userID);
        if (!user) throw createHttpError(404, "User Not Found.");

        const parsedResult = UserPasswordUpdateSubmitSchema.safeParse(data);
        if (!parsedResult.success) {
            const {errors, message = "Failed To Update Password."} = parsedResult.error;
            throw new ZodParseError({message, errors});
        }

        const hashedPassword = await bcrypt.hash(data.password, 12);
        if (!hashedPassword) throw createHttpError(500, "Something went wrong hashing passwords. Please try again.");

        user.password = hashedPassword;
        await user.save();
    }
}