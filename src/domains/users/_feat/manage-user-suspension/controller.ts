/**
 * @fileoverview Express controllers for administering user account suspension status and logging moderation outcomes.
 */

import type {Request, Response} from "express";
import type {ManageUserSuspensionRouteConfig} from "@/domains/users/_feat/manage-user-suspension/route-config";
import {updateUserSuspension} from "@/domains/users/_feat/manage-user-suspension/service";
import type {UserSuspensionUpdateInputData} from "@/domains/users/_feat/manage-user-suspension/schema";

/**
 * Express controller that updates a user account suspension status and logs the moderation outcome.
 */
export async function patchUpdateUserSuspension(
    req: Request, res: Response,
): Promise<Response> {
    const {userId} = req.parsedConfig as ManageUserSuspensionRouteConfig;
    const data = req.validatedBody as UserSuspensionUpdateInputData;

    const {user, log} = await updateUserSuspension({
        userID: userId,
        adminID: req.authUserID!,
        data,
    });

    return res.status(200).json({user, log});
}