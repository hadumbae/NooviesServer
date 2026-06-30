/**
 * @fileoverview Controller for handling requests to fetch showing details view data.
 */

import type {Request, Response} from "express";
import {fetchShowingDetailsViewData, type ShowingDetailsViewRouteConfig} from "@/domains/showing/_feat/admin-view-data";

/**
 * Express handler that retrieves composite data for the showing details admin view.
 */
export async function getFetchShowingDetailsViewData(
    req: Request, res: Response
): Promise<Response> {
    const {slug} = req.parsedConfig as ShowingDetailsViewRouteConfig;
    const data = await fetchShowingDetailsViewData({slug});
    return res.status(200).json(data);
}