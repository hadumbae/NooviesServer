import type {ZUser} from "../../users/schema/UserSchema.js";
import {safeParse} from "../../../shared/utility/zod/ZodParsers.js";
import {type UserRegisterData, UserRegisterSubmitSchema} from "../schema/UserRegisterSubmitSchema.js";
import ZodParseError from "../../../shared/errors/ZodParseError.js";
import bcrypt from "bcryptjs";
import User from "../../users/model/User.js";
import {Types} from "mongoose";
import createHttpError from "http-errors";
import {z, type ZodIssue} from "zod";
import jwt from "jsonwebtoken";
import type {UserCredentials} from "../types/UserCredentials.js";

export interface IAuthService {
    login(params: { email: string, password: string }): Promise<UserCredentials>;

    register(params: UserRegisterData): Promise<ZUser>;

    toggleAdmin(params: { userID: Types.ObjectId | string }): Promise<ZUser>;
}

// Admin Account Credentials
// john@doe.com
// K&]B94U32P'L+h$<~n>&N7*'

// Client Account Credentials
// bane@doe.com
// D^iR8_{n$`jZ:>9qK:=$E/4u+=N0$?2L
// 6'Q7a0)7,M_j£$JHA)\7Tq[1!0RehgHQ

export default class AuthService implements IAuthService {
    async register(params: UserRegisterData): Promise<ZUser> {
        const data = this.validateUserRegisterData(params);
        const {name, email, password} = data!;

        await this.checkForExistingEmail({email});
        const hashedPassword = await bcrypt.hash(password, 12);

        return User.create({
            name,
            email,
            password: hashedPassword,
            isAdmin: false,
        });
    }

    async login(params: { email: string, password: string }): Promise<UserCredentials> {
        const user = await User.findOne({email: params.email});
        if (!user) throw createHttpError(404, "User not found!");

        const isValid = await bcrypt.compare(params.password, user.password);

        if (!isValid) {
            const error = {code: "invalid_string", message: "Incorrect Password.", path: ["password"]};
            throw new ZodParseError({message: "Authentication failed.", errors: [error as ZodIssue]});
        }

        const {_id, name, email, isAdmin = false} = user;
        const tokenData = {name, email, isAdmin, user: _id};

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
    
    validateUserRegisterData(userData: UserRegisterData): UserRegisterData {
        const {data, errors} = safeParse<typeof UserRegisterSubmitSchema, UserRegisterData>({
            schema: UserRegisterSubmitSchema,
            data: userData,
        });

        if (errors) throw new ZodParseError({errors, message: "Invalid Register Details."});

        return data!;
    }

    async checkForExistingEmail({email}: {email: string}) {
        const emailCount = await User.countDocuments({email});

        if (emailCount > 0) {
            const errors: ZodIssue[] = [{code: z.ZodIssueCode.custom, path: ['email'], message: "Email is already in use!"}];
            throw new ZodParseError({errors: errors});
        }
    }
};