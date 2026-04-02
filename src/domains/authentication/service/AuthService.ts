/**
 * @file Service class handling authentication and user-related business logic.
 * @filename AuthService.ts
 */

import "dotenv/config";
import {type UserRegisterInput} from "../schema/UserRegisterInputSchema.js";
import { RequestValidationError } from "@shared/errors/RequestValidationError";
import bcrypt from "bcryptjs";
import User from "@models/User.model.js";
import {Types} from "mongoose";
import createHttpError from "http-errors";
import {z, type ZodIssue} from "zod";
import jwt from "jsonwebtoken";
import type {UserCredentials} from "../types/UserCredentials.js";
import type {UserSchemaFields} from "@models/User.types.js";
import type {UserLoginInput} from "../schema/UserLoginInputSchema.js";
import type {AuthServiceMethods} from "./AuthService.types.js";

/**
 * Orchestrates user identity operations including registration, login, and role management.
 */
export default class AuthService implements AuthServiceMethods {
    /**
     * Handles the creation of a new user account with hashed credentials.
     * @param data - Validated registration payload.
     * @returns The persisted user document.
     */
    async register(data: UserRegisterInput): Promise<UserSchemaFields> {
        const {name, email, password} = data;

        await this.checkForExistingEmail(email);
        const hashedPassword = await bcrypt.hash(password, 12);

        return User.create({
            name,
            email,
            password: hashedPassword,
            isAdmin: false,
        });
    }

    /**
     * Validates credentials and generates a session token.
     * @param data - Login identifiers (email/password).
     * @returns A session object containing user identity and a JWT.
     */
    async login(data: UserLoginInput): Promise<UserCredentials> {
        const {email: inputEmail, password: inputPassword} = data;

        const user = await User.findOne({email: inputEmail});
        if (!user) throw createHttpError(404, "User not found!");
        const {_id, name, email, roles, password, uniqueCode} = user;

        const isValid = await bcrypt.compare(inputPassword, password);
        if (!isValid) {
            const error = {code: "invalid_string", message: "Incorrect Password.", path: ["password"]};
            throw new RequestValidationError({message: "Authentication failed.", errors: [error as ZodIssue]});
        }

        const userDetails = {
            isAdmin: roles.includes("ADMIN"),
            user: {_id, roles, name, email, uniqueCode},
        };

        const token: string = jwt.sign(userDetails, process.env.JWT_TOKEN_KEY!, {expiresIn: "72h"});

        return {
            ...userDetails,
            token
        };
    }

    /**
     * Modifies user access levels by adding or removing the 'ADMIN' role.
     * @param userID - Target user's MongoDB ObjectId.
     * @returns The updated user document.
     */
    async toggleAdmin(userID: Types.ObjectId): Promise<UserSchemaFields> {
        const user = await User.findById(userID);
        if (!user) throw createHttpError(404, "User not found!");

        const {roles} = user;

        if (roles.includes("ADMIN")) {
            user.roles = roles.filter((r) => r !== "ADMIN");
        } else {
            user.roles = [...roles, "ADMIN"];
        }

        return user.save();
    }

    /**
     * Performs a preemptive check for email uniqueness in the database.
     * @param email - String email to verify.
     */
    async checkForExistingEmail(email: string) {
        const emailCount = await User.countDocuments({email});
        if (emailCount > 0) {
            const errors: ZodIssue[] = [{
                code: z.ZodIssueCode.custom,
                path: ['email'],
                message: "Email is already in use!"
            }];
            throw new RequestValidationError({errors});
        }
    }
}