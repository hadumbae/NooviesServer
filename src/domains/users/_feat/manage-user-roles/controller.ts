/**
 * @fileoverview Express controllers for granting and revoking administrative privileges for user accounts.
 */

import type {Request, Response} from "express";
import {manageUserAdminRole} from "@/domains/users/_feat/manage-user-roles/service";
import {type ManageUserRolesRouteConfig} from "@/domains/users/_feat/manage-user-roles/route-config";

/**
 * Express controller that grants the administrative role to a user and logs the moderation event.
 */
export async function patchGrantUserAdminRole(
    req: Request, res: Response,
): Promise<Response> {
    const {userId} = req.parsedConfig as ManageUserRolesRouteConfig;

    const {user, log} = await manageUserAdminRole({
        userId,
        adminId: req.authUserID!,
        data: req.validatedBody,
        grantAdmin: true,
    });

    return res.status(200).json({user, log});
}

/**
 * Express controller that revokes the administrative role from a user and logs the moderation event.
 */
export async function patchRevokeUserAdminRole(
    req: Request, res: Response,
): Promise<Response> {
    const {userId} = req.parsedConfig as ManageUserRolesRouteConfig;

    const {user, log} = await manageUserAdminRole({
        userId,
        adminId: req.authUserID!,
        data: req.validatedBody,
        grantAdmin: false,
    });

    return res.status(200).json({user, log});
}