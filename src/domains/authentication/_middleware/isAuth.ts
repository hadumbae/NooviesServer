/**
 * @fileoverview Middleware for authenticating requests using JWT tokens stored in cookies.
 */

import type {NextFunction, Request, Response} from 'express';
import createHttpError from "http-errors";
import {Types} from "mongoose";
import {decodeAuthToken} from "@/domains/authentication/_middleware/decodeAuthToken";

/**
 * Express middleware that validates the JWT session and hydrates the request with user identity. */
export function isAuth(req: Request, res: Response, next: NextFunction) {
    const {authToken} = req.cookies;
    if (!authToken) {
        throw createHttpError(401, "Authentication required: No token provided.");
    }

    const {user, isAdmin, status} = decodeAuthToken(authToken);

    if (status !== "ACTIVE") {
        throw createHttpError(401, "Invalid User. Please contact support.");
    }

    req.isLoggedIn = true;
    req.authToken = authToken;

    req.authUserID = Types.ObjectId.createFromHexString(user._id.toString());
    req.authUserIsAdmin = isAdmin;
    req.authUserStatus = status;

    next();
}