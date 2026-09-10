/**
 * @fileoverview Middleware to restrict route access to users with administrative privileges.
 */

import type {Request, Response, NextFunction} from 'express';
import createHttpError from "http-errors";

/** Express middleware that validates the presence of administrative privileges on the request object. */
export function isAdmin(req: Request, res: Response, next: NextFunction) {
    const {authUserIsAdmin: isAdmin} = req;
    if (!isAdmin) throw createHttpError(403, "Access denied: Administrative privileges required.");
    next();
}