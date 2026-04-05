/**
 * @file Express middleware for role-based authorization of administrative users.
 * @filename isAdmin.ts
 */

import type {Request, Response, NextFunction} from 'express';
import createHttpError from "http-errors";

/**
 * Ensures the requester possesses administrative privileges before proceeding.
 * ---
 */
export default function isAdmin(req: Request, res: Response, next: NextFunction) {
    const {authUserAdmin: isAdmin} = req;
    if (!isAdmin) throw createHttpError(401, "Access denied: Administrative privileges required.");
    next();
}