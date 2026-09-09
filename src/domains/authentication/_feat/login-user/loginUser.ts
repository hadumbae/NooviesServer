/**
 * @fileoverview Handles user authentication by validating credentials and generating a JWT.
 */

import type {UserLoginInput} from "@/domains/authentication/_feat/login-user/UserLoginInputSchema";
import {User} from "@/domains/users/model/user";
import createHttpError from "http-errors";
import bcrypt from "bcryptjs";
import {RequestValidationError} from "@/shared/errors/RequestValidationError";
import type {ZodIssue} from "zod";
import jwt from "jsonwebtoken";
import {AuthTokenPayloadSchema, type AuthUserCredentials} from "@/domains/authentication";

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

    if (!user) {
        throw createHttpError(404, "User not found!");
    }

    const {_id, name, email, roles, password, uniqueCode, status} = user;

    if (status !== "ACTIVE") {
        throw createHttpError(401, "User is suspended/inactive!");
    }

    const isValid = await bcrypt.compare(inputPassword, password);

    if (!isValid) {
        const error = {code: "invalid_string", message: "Incorrect Password.", path: ["password"]};
        throw new RequestValidationError({message: "Authentication failed.", errors: [error as ZodIssue]});
    }

    const {data: payload, success} = AuthTokenPayloadSchema.safeParse({
        isAdmin: roles.includes("ADMIN"),
        user: {_id, roles, name, email, uniqueCode, status},
        status,
    });

    if (!success) {
        throw createHttpError(500, "Unable to generate credentials. Please try again.");
    }

    const token: string = jwt.sign(payload, process.env.JWT_SECRET!, {expiresIn: "72h"});

    return {
        ...payload,
        token
    };
}