/**
 * @fileoverview Express controller for retrieving validated aggregate homepage view data for authenticated or anonymous users.
 */

import type {Request, Response} from "express";
import {fetchHomepageViewData, type HomepageViewDataRouteConfig} from "@/domains/homepage/_feat/load-data";

/** Express request handler that extracts user context and config to serve homepage view data. */
export async function getFetchHomepageViewData(req: Request, res: Response) {
    const userID = req.authUserID;
    const config = req.parsedConfig as HomepageViewDataRouteConfig;

    const data = await fetchHomepageViewData({user: userID, ...config});
    return res.status(200).json(data);
}