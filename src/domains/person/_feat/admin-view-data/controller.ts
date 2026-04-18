/**
 * @fileoverview Controller for handling requests to fetch Person Details view data.
 * Orchestrates the retrieval of combined biographical and filmography information.
 */

import type {Request, Response} from "express";
import type {PersonDetailsViewRouteConfig} from "@domains/person/_feat/admin-view-data/routeSchemas";
import {fetchPersonDetailsViewData} from "@domains/person/_feat/admin-view-data/service";

/**
 * Handles the GET request to retrieve comprehensive data for the Person Details view.
 */
export async function getFetchPersonDetailsViewData(
    req: Request, res: Response,
): Promise<Response> {
    const {_id, limit} = req.parsedConfig as PersonDetailsViewRouteConfig;
    const data = await fetchPersonDetailsViewData({_id, limit});
    return res.status(200).json(data);
}