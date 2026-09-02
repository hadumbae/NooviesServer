/**
 * @fileoverview Utility for decoding and verifying JWT authentication tokens.
 */

import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import {Types} from "mongoose";

/** Decodes and validates a JWT token, returning the embedded user payload and admin status. */
export function decodeAuthToken(token: any) {
    let decodedToken;

    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (e) {
        throw createHttpError(500, "Authorization failed: Token verification error.");
    }

    if (!decodedToken) {
        throw createHttpError(401, "Unauthorized: Invalid session.");
    }

    const {user, isAdmin} = decodedToken as any;

    if (!user || !user._id || !Types.ObjectId.isValid(user._id)) {
        throw createHttpError(401, "Invalid user identification in session.");
    }

    return {
        user,
        isAdmin,
    }
}