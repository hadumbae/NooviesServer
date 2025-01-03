import type {IAuthRegisterService, IAuthRegisterData} from "./IAuthRegisterService.js";
import type {ZUser} from "../../users/schema/UserSchema.js";
import {safeParseAsync} from "../../../shared/utility/zod/ZodParsers.js";
import ZodParseError from "../../../shared/errors/ZodParseError.js";

import bcrypt from "bcryptjs";
import User from "../../users/model/User.js";
import {Types} from "mongoose";
import createHttpError from "http-errors";
import {type UserRegisterData, UserRegisterSchema} from "../schema/UserRegisterSchema.js";

const AuthRegisterService: IAuthRegisterService = {
    async register(params: IAuthRegisterData): Promise<ZUser> {
        const {data, errors} = await safeParseAsync<
            typeof UserRegisterSchema,
            UserRegisterData
        >({
            schema: UserRegisterSchema,
            data: params,
        });

        if (errors) {
            throw new ZodParseError({errors, message: "Invalid Register Details."});
        }

        const {name, email, password} = data!;
        const hashedPassword = await bcrypt.hash(password, 12);

        return User.create({
            name,
            email,
            password: hashedPassword,
            isAdmin: false
        });
    },

    async toggleAdmin({userID}: {userID: Types.ObjectId | string}): Promise<ZUser> {
        const user = await User.findById(userID);
        if (!user) throw createHttpError(404, "User not found!");

        user.isAdmin = !user.isAdmin;
        return user.save();
    }
};

export default AuthRegisterService;