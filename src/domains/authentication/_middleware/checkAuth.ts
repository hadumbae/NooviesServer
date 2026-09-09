/**
 * @fileoverview Express middleware for authenticating requests via JWT cookies and populating auth context.
 */

import type {NextFunction, Request, Response} from 'express';
import {Types} from "mongoose";
import {decodeAuthToken} from "@/domains/authentication/_middleware/decodeAuthToken";
import createHttpError from "http-errors";

/** Validates the JWT auth cookie and attaches user authentication state to the request object. */
export function checkAuth(req: Request, res: Response, next: NextFunction) {
    const {authToken: token} = req.cookies;
    if (!token) {
        next();
        return;
    }

    const {user, isAdmin, status} = decodeAuthToken(token);

    if (status !== "ACTIVE") {
        throw createHttpError(401, "Invalid User. Please contact support.");
    }

    req.authUserID = Types.ObjectId.createFromHexString(user._id.toString());
    req.authUserAdmin = isAdmin;

    next();
}