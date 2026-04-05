/**
 * @file Express middleware for JWT-based session authentication via cookies.
 * @filename isAuth.ts
 */

import type {Request, Response, NextFunction} from 'express';
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import {Types} from "mongoose";

/**
 * Validates the requester's identity by verifying a secure `authToken` cookie.
 * ---
 * ### Mechanics
 * * **Token Extraction:** Retrieves the JWT from `req.cookies.authToken`. Requires
 * `cookie-parser` to be initialized in the Express app.
 * * **Integrity Check:** Uses `jwt.verify` against `process.env.JWT_SECRET` to ensure
 * the token hasn't been tampered with.
 * * **Identity Injection:** Decodes the payload and attaches a Mongoose `ObjectId`
 * to `req.authUserID` and a boolean to `req.authUserAdmin` for downstream access.
 * * **Validation:** Strictly verifies that the `user._id` in the payload is a
 * valid BSON hex string before proceeding.
 * ---
 * @throws {HttpError} 401 - If the token is missing, invalid, or contains malformed data.
 * @throws {HttpError} 500 - If an unexpected error occurs during JWT verification.
 */
export default function isAuth(req: Request, res: Response, next: NextFunction) {
    // --- EXTRACT TOKEN ---

    const {authToken: token} = req.cookies;
    if (!token) throw createHttpError(401, "Authentication required: No token provided.");

    // --- VERIFY AND DECODE
    let decodedToken;

    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (e) {
        throw createHttpError(500, "Authorization failed: Token verification error.");
    }

    if (!decodedToken) {
        throw createHttpError(401, "Unauthorized: Invalid session.");
    }

    // --- VALIDATE AND EXTRACT ---
    const {user, isAdmin} = decodedToken as any;

    if (!user || !user._id || !Types.ObjectId.isValid(user._id)) {
        throw createHttpError(401, "Invalid user identification in session.");
    }

    // --- HYDRATE REQUEST ---
    req.authUserID = Types.ObjectId.createFromHexString(user._id);
    req.authUserAdmin = !!isAdmin;

    next();
}