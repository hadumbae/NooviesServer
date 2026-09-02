/**
 * @fileoverview Middleware for authenticating requests using JWT tokens stored in cookies.
 */

import type {NextFunction, Request, Response} from 'express';
import createHttpError from "http-errors";
import {Types} from "mongoose";
import {decodeAuthToken} from "@/domains/authentication/middleware/decodeAuthToken";

/**
 * Express middleware that validates the JWT session and hydrates the request with user identity. */
export function isAuth(req: Request, res: Response, next: NextFunction) {
    const {authToken: token} = req.cookies;
    if (!token) throw createHttpError(401, "Authentication required: No token provided.");

    const {user, isAdmin} = decodeAuthToken(token);

    req.authUserID = Types.ObjectId.createFromHexString(user._id);
    req.authUserAdmin = !!isAdmin;

    next();
}