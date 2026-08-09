/**
 * @fileoverview Express controller for handling requests to update a user's admin role assignments.
 */

import type {Request, Response} from "express";
import {manageUserAdminRole} from "@/domains/users/_feat/manage-user-roles/service";
import {type ManageUserRolesRouteConfig} from "@/domains/users/_feat/manage-user-roles/route-config";

/**
 * Express controller that updates a user's administrative roles and returns the updated user and log details.
 */
export async function patchUpdateUserAdminRole(
    req: Request, res: Response,
): Promise<Response> {
    const {userId} = req.parsedConfig as ManageUserRolesRouteConfig;

    const {user, log} = await manageUserAdminRole({
        userId,
        adminId: req.authUserID!,
        data: req.validatedBody,
    });

    return res.status(200).json({user, log});
}