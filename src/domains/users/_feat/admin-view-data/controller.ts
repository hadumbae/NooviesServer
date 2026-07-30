/**
 * @fileoverview Controller for handling requests to fetch administrative view data for user details.
 */

import type {Request, Response} from "express";
import {
    fetchUserDetailsViewData,
    type UserDetailsViewRouteConfig
} from "@/domains/users/_feat/admin-view-data/user-details-view";

/** Express controller that retrieves composite user data based on parsed route configuration. */
export async function getFetchUserDetailsViewData(req: Request, res: Response): Promise<Response> {
    const {userID} = req.parsedConfig as UserDetailsViewRouteConfig;
    const data = await fetchUserDetailsViewData({user: userID});

    return res.status(200).json(data);
}