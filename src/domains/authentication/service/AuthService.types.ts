import type {UserCredentials} from "../types/UserCredentials.js";
import type {UserRegisterInput} from "../schema/UserRegisterInputSchema.js";
import type {UserSchemaFields} from "@models/User.types.js";
import {Types} from "mongoose";
import type {UserLoginInput} from "../schema/UserLoginInputSchema.js";

/**
 * Interface defining the methods available in the authentication service.
 *
 * Includes methods for logging in, registering, toggling admin privileges,
 * and checking for the existence of an email.
 *
 * @example
 * ```ts
 * const authService: AuthServiceMethods = getAuthService();
 *
 * const credentials = await authService.login({ email: "jane@example.com", password: "securePassword123" });
 * const newUser = await authService.register({ name: "Jane Doe", email: "jane@example.com", password: "securePassword123", confirm: "securePassword123" });
 * const updatedUser = await authService.toggleAdmin(new Types.ObjectId("64b0f1f1e3b8c3d1f4a2a2b3"));
 * authService.checkForExistingEmail("jane@example.com"); // ❌ throws if email exists
 * ```
 */
export interface AuthServiceMethods {
    /** Logs in a user with email and password. Returns user credentials on success. */
    login(params: UserLoginInput): Promise<UserCredentials>;

    /** Registers a new user. Returns the created user document. */
    register(params: UserRegisterInput): Promise<UserSchemaFields>;

    /** Toggles the admin role for a given user. Returns the updated user document. */
    toggleAdmin(userID: Types.ObjectId): Promise<UserSchemaFields>;

    /** Checks if the given email already exists. Throws if it does. */
    checkForExistingEmail(email: string): void;
}
