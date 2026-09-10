/**
 * @fileoverview Utility function for retrieving the authenticated user document from an Express request context.
 */

import type {Request} from "express";
import {User} from "@/domains/users";
import createHttpError from "http-errors";

/** Fetches the active user's document from the database using the request's authenticated user ID. */
export async function fetchRequestUser(req: Request) {
    const {authUserID} = req;
    if (!authUserID) throw createHttpError(401, "Login Required.");

    const user = await User.findById(authUserID);
    if (!user) throw createHttpError(401, "Improper credentials. Please try again.");

    return user;
}