/**
 * @fileoverview Utility to resolve and authorize the currently authenticated Administrator.
 */

import type {Request} from "express";
import {User} from "@/domains/users/model/user/User.model";
import createHttpError from "http-errors";
import type {UserSchemaFields} from "@/domains/users/model/user/User.types";

/** Configuration for the fetchAuthAdmin function. */
type FetchParams = {
    req: Request
}

/** Validates the current session's user and ensures they possess administrative privileges. */
export async function fetchAuthAdmin({req}: FetchParams): Promise<UserSchemaFields> {
    const userID = req.authUserID;
    const user = await User.findById(userID);

    if (!user || !user.roles.includes("ADMIN")) {
        throw createHttpError(401, "Unauthorized.");
    }

    return user;
}