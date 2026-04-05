/**
 * @file Backend utility to resolve and authorize the currently authenticated Administrator.
 * @filename fetchAuthAdmin.ts
 */

import type {Request} from "express";
import User from "@models/User.model";
import createHttpError from "http-errors";
import type {UserSchemaFields} from "@models/User.types";

/**
 * Configuration for {@link fetchAuthAdmin}
 */
type FetchParams = {
    /** The Express request object containing the middleware-injected auth context. */
    req: Request
}

/**
 * Validates the current session's user and ensures they possess administrative privileges.
 * ---
 * @throws {HttpError} 401 - If the user is not found or is not an administrator.
 * @returns {Promise<UserSchemaFields>} The hydrated Mongoose user document.
 */
export async function fetchAuthAdmin({req}: FetchParams): Promise<UserSchemaFields> {
    const userID = req.authUserID;
    const user = await User.findById(userID);

    /** Fail-safe: Verify existence and administrative role membership */
    if (!user || !user.roles.includes("ADMIN")) {
        throw createHttpError(401, "Unauthorized.");
    }

    return user;
}