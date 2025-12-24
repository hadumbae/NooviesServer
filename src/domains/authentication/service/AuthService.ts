import {type UserRegisterInput} from "../schema/UserRegisterInputSchema.js";
import ZodParseError from "../../../shared/errors/ZodParseError.js";
import bcrypt from "bcryptjs";
import User from "../../users/model/User.js";
import {Types} from "mongoose";
import createHttpError from "http-errors";
import {z, type ZodIssue} from "zod";
import jwt from "jsonwebtoken";
import type {UserCredentials} from "../types/UserCredentials.js";
import type UserSchemaFields from "@models/UserSchemaFields.js";
import type {UserLoginInput} from "../schema/UserLoginInputSchema.js";
import type {AuthServiceMethods} from "./AuthService.types.js";

/**
 * Service class handling authentication operations.
 *
 * Implements `AuthServiceMethods` and provides business logic for:
 * - Registering new users
 * - Logging in users
 * - Toggling admin roles
 * - Checking for existing emails
 *
 * @example
 * ```ts
 * const authService = new AuthService();
 *
 * // Register a user
 * const newUser = await authService.register({
 *   name: "Jane Doe",
 *   email: "jane@example.com",
 *   password: "securePassword123",
 *   confirm: "securePassword123"
 * });
 *
 * // Login
 * const credentials = await authService.login({
 *   email: "jane@example.com",
 *   password: "securePassword123"
 * });
 *
 * // Toggle admin role
 * const updatedUser = await authService.toggleAdmin(newUser._id);
 *
 * // Check for existing email
 * await authService.checkForExistingEmail("jane@example.com");
 * ```
 */
export default class AuthService implements AuthServiceMethods {
    /**
     * Registers a new user.
     *
     * @param data - User registration input.
     * @returns The created user document.
     * @throws ZodParseError if the email is already in use.
     */
    async register(data: UserRegisterInput): Promise<UserSchemaFields> {
        const {name, email, password} = data;

        // --- CHECK EMAIL ---
        await this.checkForExistingEmail(email);

        // --- CREATE USER ---
        const hashedPassword = await bcrypt.hash(password, 12);

        return User.create({
            name,
            email,
            password: hashedPassword,
            isAdmin: false,
        });
    }

    /**
     * Logs in a user.
     *
     * @param data - User login input containing email and password.
     * @returns User credentials including JWT token.
     * @throws HttpError 404 if user is not found.
     * @throws ZodParseError if password is incorrect.
     */
    async login(data: UserLoginInput): Promise<UserCredentials> {
        const {email: inputEmail, password: inputPassword} = data;

        // --- FETCH USER ---
        const user = await User.findOne({email: inputEmail});
        if (!user) throw createHttpError(404, "User not found!");

        const {_id, name, email, roles, password} = user;

        // --- VALIDATE PASSWORD ---
        const isValid = await bcrypt.compare(inputPassword, password);
        if (!isValid) {
            const error = {code: "invalid_string", message: "Incorrect Password.", path: ["password"]};
            throw new ZodParseError({message: "Authentication failed.", errors: [error as ZodIssue]});
        }

        // --- USER DETAILS ---
        const userDetails = {
            isAdmin: roles.includes("ADMIN"),
            user: {_id, roles, name, email},
        };

        const token: string = jwt.sign(userDetails, "somesupersecretsecretsecret", {expiresIn: "72h"});

        return {
            ...userDetails,
            token
        };
    }

    /**
     * Toggles the admin role for a user.
     *
     * @param userID - The ObjectId of the user.
     * @returns The updated user document.
     * @throws HttpError 404 if the user is not found.
     */
    async toggleAdmin(userID: Types.ObjectId): Promise<UserSchemaFields> {
        // --- FETCH USER ---
        const user = await User.findById(userID);
        if (!user) throw createHttpError(404, "User not found!");

        const {roles} = user;

        // --- TOGGLE ROLE ---
        if (roles.includes("ADMIN")) {
            user.roles = roles.filter((r) => r !== "ADMIN");
        } else {
            user.roles = [...roles, "ADMIN"];
        }

        // --- SAVE ---
        return user.save();
    }

    /**
     * Checks whether an email is already in use.
     *
     * @param email - Email to check.
     * @throws ZodParseError if the email already exists.
     */
    async checkForExistingEmail(email: string) {
        const emailCount = await User.countDocuments({email});
        if (emailCount > 0) {
            const errors: ZodIssue[] = [{
                code: z.ZodIssueCode.custom,
                path: ['email'],
                message: "Email is already in use!"
            }];
            throw new ZodParseError({errors});
        }
    }
}
