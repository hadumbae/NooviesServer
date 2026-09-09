/**
 * @fileoverview Express controller for granting administrative privileges to a user.
 */

import type {Request, Response} from "express";
import {type ManageUserRouteConfig} from "@/domains/authentication/_feat/manage-users";
import {grantAdminStatus} from "@/domains/authentication/_feat/toggle-admin-status/grantAdminStatus";

/** Grants administrative privileges to a specific user by their ID. */
export async function postGrantAdminStatus(req: Request, res: Response): Promise<Response> {
    const {userId} = req.parsedConfig as ManageUserRouteConfig;

    await grantAdminStatus(userId);

    return res.status(200).json({message: "User Admin Status granted successfully."});
}