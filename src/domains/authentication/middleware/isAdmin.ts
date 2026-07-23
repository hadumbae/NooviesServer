/**
 * @fileoverview Middleware to restrict route access to users with administrative privileges.
 */

import type {Request, Response, NextFunction} from 'express';
import createHttpError from "http-errors";

/** Express middleware that validates the presence of administrative privileges on the request object. */
export function isAdmin(req: Request, res: Response, next: NextFunction) {
    const {authUserAdmin: isAdmin} = req;
    if (!isAdmin) throw createHttpError(401, "Access denied: Administrative privileges required.");
    next();
}