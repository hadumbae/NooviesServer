/**
 * @fileoverview Express controller for handling user password update requests.
 */

import type {Request, Response} from "express";
import type {
    UserPasswordUpdateInput
} from "@/domains/authentication/_feat/change-user-password/UserPasswordUpdateInputSchema";
import type {ManageUserRouteConfig} from "@/domains/authentication/_feat/manage-users";
import {updateUserPassword} from "@/domains/authentication/_feat/change-user-password/changeUserPassword";

/** Updates the password for a specified user account. */
export async function postChangeUserPassword(req: Request, res: Response): Promise<Response> {
    const {userId} = req.parsedConfig as ManageUserRouteConfig;
    const data = req.validatedBody as UserPasswordUpdateInput;

    await updateUserPassword({
        authUserId: req.authUserID,
        userId,
        data
    });

    return res.status(200).json({message: "Updated password successfully."});
}