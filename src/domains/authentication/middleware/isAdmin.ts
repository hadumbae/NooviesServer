import type { Request, Response, NextFunction } from 'express';
import createHttpError from "http-errors";

/**
 * Express middleware to authorize admin users.
 *
 * Checks the `authUserAdmin` property on the request object (set by authentication middleware)
 * and ensures the current user has admin privileges.
 *
 * @param req - Express request object, must have `authUserAdmin` set.
 * @param res - Express response object.
 * @param next - Express next middleware function.
 * @throws HttpError 401 if the user is not an admin.
 *
 * @example
 * ```ts
 * import express from 'express';
 * import isAuth from './isAuth.js';
 * import isAdmin from './isAdmin.js';
 *
 * const app = express();
 *
 * app.patch('/users/:_id/admin', isAuth, isAdmin, (req, res) => {
 *   // Only admins can reach this route
 *   res.json({ message: "Admin action performed." });
 * });
 * ```
 */
export default function isAdmin(req: Request, res: Response, next: NextFunction) {
    const { authUserAdmin: isAdmin } = req;

    if (!isAdmin) {
        throw createHttpError(401, "Unauthorized.");
    }

    next();
}
