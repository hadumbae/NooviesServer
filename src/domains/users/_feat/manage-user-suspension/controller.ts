/**
 * @fileoverview Express controllers for administering user account suspension status and logging moderation outcomes.
 */

import type {Request, Response} from "express";
import type {ManageUserSuspensionRouteConfig} from "@/domains/users/_feat/manage-user-suspension/route-config";
import {liftUserSuspension, suspendUser} from "@/domains/users/_feat/manage-user-suspension/service";
import type {UserSuspensionUpdateInputData} from "@/domains/users";

/**
 * Express controller that suspends a user account and logs the related action metadata.
 */
export async function patchSuspendUser(
    req: Request, res: Response,
): Promise<Response> {
    const {userId} = req.parsedConfig as ManageUserSuspensionRouteConfig;
    const data = req.validatedBody as UserSuspensionUpdateInputData;

    const {user, log} = await suspendUser({
        userID: userId,
        adminID: req.authUserID!,
        data,
    });

    return res.status(200).json({user, log});
}

/**
 * Express controller that lifts an active user account suspension and logs the restoration action metadata.
 */
export async function patchLiftUserSuspension(
    req: Request, res: Response,
): Promise<Response> {
    const {userId} = req.parsedConfig as ManageUserSuspensionRouteConfig;
    const data = req.validatedBody as UserSuspensionUpdateInputData;

    const {user, log} = await liftUserSuspension({
        userID: userId,
        adminID: req.authUserID!,
        data,
    });

    return res.status(200).json({user, log});
}