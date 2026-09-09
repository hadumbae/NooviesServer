/**
 * @fileoverview Express controller for revoking administrative privileges from a user.
 */

import type {Request, Response} from "express";
import {type ManageUserRouteConfig} from "@/domains/authentication/_feat/manage-users";
import {revokeAdminStatus} from "@/domains/authentication/_feat/toggle-admin-status/revokeAdminStatus";

/** Revokes administrative privileges from a specific user by their ID. */
export async function postRevokeAdminStatus(req: Request, res: Response): Promise<Response> {
    const {userId} = req.parsedConfig as ManageUserRouteConfig;

    await revokeAdminStatus(userId);

    return res.status(200).json({message: "User Admin Status revoked successfully."});
}