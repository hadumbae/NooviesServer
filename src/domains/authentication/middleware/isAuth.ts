import type { Request, Response, NextFunction } from 'express';
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";

/**
 * Express middleware to authenticate requests using a JWT stored in cookies.
 *
 * Verifies the presence and validity of the `authToken` cookie, decodes the token,
 * and attaches user information to the request object.
 *
 * Sets the following properties on `req`:
 * - `authUserID` – the ID of the authenticated user.
 * - `authUserAdmin` – boolean indicating if the user has admin privileges.
 *
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next middleware function.
 * @throws HttpError 401 if the token is missing or invalid.
 * @throws HttpError 500 if token verification fails.
 *
 * @example
 * ```ts
 * import express from 'express';
 * import isAuth from './middlewares/isAuth.js';
 *
 * const app = express();
 *
 * app.get('/protected', isAuth, (req, res) => {
 *   res.json({ userId: req.authUserID, isAdmin: req.authUserAdmin });
 * });
 * ```
 */
export default function isAuth(req: Request, res: Response, next: NextFunction) {
    // --- GET TOKEN ---
    const { authToken: token } = req.cookies;

    if (!token) {
        throw createHttpError(401, "Unauthorized.");
    }

    // --- DECODE TOKEN ---
    let decodedToken;

    try {
        decodedToken = jwt.verify(token, "somesupersecretsecretsecret");
    } catch (e) {
        throw createHttpError(500, "Authorization failed!.");
    }

    if (!decodedToken) {
        throw createHttpError(401, "Unauthorized.");
    }

    // --- SET AUTH DETAILS ---
    const { user, isAdmin } = decodedToken as any;
    req.authUserID = user;
    req.authUserAdmin = isAdmin;

    next();
}
