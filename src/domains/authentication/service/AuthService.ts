import type {ZUser} from "../../users/schema/UserSchema.js";
import {safeParseAsync} from "../../../shared/utility/zod/ZodParsers.js";
import {type UserRegisterData, UserRegisterSubmitSchema} from "../schema/UserRegisterSubmitSchema.js";
import ZodParseError from "../../../shared/errors/ZodParseError.js";
import bcrypt from "bcryptjs";
import User from "../../users/model/User.js";
import {Types} from "mongoose";
import createHttpError from "http-errors";
import type {ZodIssue} from "zod";
import jwt from "jsonwebtoken";
import type {UserCredentials} from "../types/UserCredentials.js";

export interface IAuthService {
    login(params: { email: string, password: string }): Promise<UserCredentials>;
    register(params: UserRegisterData): Promise<ZUser>;
    toggleAdmin(params: { userID: Types.ObjectId | string }): Promise<ZUser>;
}

export default class AuthService implements IAuthService {
    async register(params: UserRegisterData): Promise<ZUser> {
        const {data, errors} = await safeParseAsync<typeof UserRegisterSubmitSchema, UserRegisterData>({
            schema: UserRegisterSubmitSchema,
            data: params,
        });

        if (errors) throw new ZodParseError({errors, message: "Invalid Register Details."});

        const {name, email, password} = data!;
        const hashedPassword = await bcrypt.hash(password, 12);

        return User.create({
            name,
            email,
            password: hashedPassword,
            isAdmin: false
        });
    }

    // john@doe.com
    // K&]B94U32P'L+h$<~n>&N7*'

    async login(params: { email: string, password: string }): Promise<UserCredentials> {
        const {email, password} = params;

        const user = await User.findOne({email});
        if (!user) throw createHttpError(404, "User not found!");

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            const error = {code: "invalid_string", message: "Incorrect Password.", path: ["password"]};
            throw new ZodParseError({message: "Authentication failed.", errors: [error as ZodIssue]});
        }

        const tokenData = {
            user: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        };

        const key = "somesupersecretsecretsecret";
        const token: string = jwt.sign(tokenData, key, {expiresIn: "24h"});

        return {...tokenData, token};
    }

    async toggleAdmin({userID}: { userID: Types.ObjectId | string }): Promise<ZUser> {
        const user = await User.findById(userID);
        if (!user) throw createHttpError(404, "User not found!");

        user.isAdmin = !user.isAdmin;
        return user.save();
    }
};