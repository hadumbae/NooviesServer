/**
 * @fileoverview Express request handler for updating user account status.
 */

import type {Request, Response} from 'express'
import type {ManageUserStatusRouteConfig} from "@/domains/users/_feat/manage-user-status/route-config";
import {updateUserStatus} from "@/domains/users/_feat/manage-user-status/service";
import type {UserStatusUpdateInputData} from "@/domains/users/_feat/manage-user-status/schema";

/**
 * Express controller handler that processes HTTP PATCH requests to update a user's account status.
 */
export async function patchUpdateUserStatus(req: Request, res: Response) {
    const adminId = req.authUserID;
    const {userId} = req.parsedConfig as ManageUserStatusRouteConfig;
    const data = req.validatedBody as UserStatusUpdateInputData;

    const {user, log} = await updateUserStatus({
        adminId: adminId!,
        userId,
        data
    });

    return res.status(200).json({user, log});
}