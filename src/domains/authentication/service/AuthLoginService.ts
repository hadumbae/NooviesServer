import User from "../../users/model/User.js";
import createHttpError from "http-errors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type {IAuthLoginService, UserCredentials} from "./IAuthLoginService.js";
import type {ZodIssue} from "zod";
import ZodParseError from "../../../shared/errors/ZodParseError.js";

const AuthLoginService: IAuthLoginService = {
    // john@doe.com
    // K&]B94U32P'L+h$<~n>&N7*'

    async login(params: {email: string, password: string}): Promise<UserCredentials> {
        const {email, password} = params;

        const user = await User.findOne({ email });
        if (!user) throw createHttpError(404, "User not found!");

        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            const error = {
                code: "invalid_string",
                message: "Incorrect Password.",
                path: ["password"]
            };

            throw new ZodParseError({message: "Authentication failed.", errors: [error as ZodIssue]});
        }

        const tokenData = {
            user: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        };


        const token: string = jwt.sign(
            tokenData,
            "somesupersecretsecretsecret",
            {expiresIn: "24h"},
        );

        return {
            ...tokenData,
            token,
        };
    }
};

export default AuthLoginService;