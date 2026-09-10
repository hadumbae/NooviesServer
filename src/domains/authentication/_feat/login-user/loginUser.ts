/**
 * @fileoverview Handles user authentication by validating credentials and generating a JWT.
 */

import type {ZodIssue} from "zod";
import bcrypt from "bcryptjs";
import createHttpError from "http-errors";
import type {UserLoginInput} from "@/domains/authentication/_feat/login-user/UserLoginInputSchema";
import {User} from "@/domains/users/model/user";
import {RequestValidationError} from "@/shared/errors/RequestValidationError";
import {type AuthUserCredentials} from "@/domains/authentication";
import {generateAuthenticationPayload} from "@/domains/authentication/_feat/login-user/generateAuthenticationPayload";

type LoginConfig = {
    data: UserLoginInput;
}

/**
 * Authenticates a user against stored credentials and returns a signed token with user details.
 * Requires a valid JWT_SECRET environment variable.
 */
export async function loginUser(
    {data: {email: inputEmail, password: inputPassword}}: LoginConfig
): Promise<AuthUserCredentials> {
    const user = await User.findOne({email: inputEmail});
    if (!user) throw createHttpError(404, "User not found!");

    const {password, status} = user;
    if (status !== "ACTIVE") throw createHttpError(401, "User is suspended/inactive!");

    const isValid = await bcrypt.compare(inputPassword, password);

    if (!isValid) {
        const error = {code: "invalid_string", message: "Incorrect Password.", path: ["password"]};
        throw new RequestValidationError({message: "Authentication failed.", errors: [error as ZodIssue]});
    }

    return generateAuthenticationPayload({user});
}