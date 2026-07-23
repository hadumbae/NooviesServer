/**
 * @fileoverview Middleware for authenticating requests using JWT tokens stored in cookies.
 */

import type {Request, Response, NextFunction} from 'express';
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import {Types} from "mongoose";

/**
 * Express middleware that validates the JWT session and hydrates the request with user identity. */
export function isAuth(req: Request, res: Response, next: NextFunction) {
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