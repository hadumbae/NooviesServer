/**
 * @fileoverview Utility for decoding and verifying JWT authentication tokens.
 */

import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import {Types} from "mongoose";
import {type AuthTokenPayload, AuthTokenPayloadSchema} from "@/domains/authentication/_validation";

/** Decodes and validates a JWT token, returning the embedded user payload and admin status. */
export function decodeAuthToken(token: string): AuthTokenPayload {
    let decodedToken;

    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (e) {
        throw createHttpError(401, "Authorization failed: Token verification error.");
    }

    const {data: payload, success} = AuthTokenPayloadSchema.safeParse(decodedToken);
    if (!success) throw createHttpError(401, "Unauthorized: Invalid session.");

    if (!payload.user || !payload.user._id || !Types.ObjectId.isValid(payload.user._id)) {
        throw createHttpError(401, "Invalid user identification in session.");
    }

    return payload;
}