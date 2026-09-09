/**
 * @fileoverview Express controller for verifying the authenticated user's administrative status.
 */

import type {Request, Response} from "express";

/** Returns the authentication ID and administrative status of the current user. */
export async function getVerifyAdminStatus(req: Request, res: Response): Promise<Response> {
    const {authUserID, authUserAdmin} = req;
    return res.status(200).json({userID: authUserID, isAdmin: authUserAdmin});
}