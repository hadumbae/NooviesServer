/**
 * @fileoverview Express middleware for validating the presence of a refresh token cookie.
 */

import type {NextFunction, Request, Response} from 'express';
import createHttpError from "http-errors";

/** Validates that a refresh token cookie exists and attaches it to the request object. */
export function hasRefreshToken(req: Request, res: Response, next: NextFunction) {
    const {refreshToken} = req.cookies;

    if (!refreshToken) {
        throw createHttpError(401, "Invalid. Refresh Token Required.");
    }

    req.refreshToken = refreshToken;
    next();
}