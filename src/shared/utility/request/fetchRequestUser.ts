/**
 * @file Request-scoped authentication utilities.
 */

import type {Request} from 'express'
import {Types} from "mongoose";
import createHttpError from "http-errors";

/**
 * Retrieves the authenticated user's identifier from the request.
 *
 * @throws HttpError
 * If no authenticated user is present.
 */
export const fetchRequestUser = (req: Request): Types.ObjectId => {
    const userID = req.authUserID;

    if (!userID) {
        throw createHttpError(403, "Unauthorized. Please log in.");
    }
    return userID;
}
