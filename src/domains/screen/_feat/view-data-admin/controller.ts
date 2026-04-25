/**
 * @fileoverview Express controller for the Theatre Screen details administrative view.
 * Bridges the validated request parameters to the service layer for data aggregation.
 */

import type {Request, Response} from "express";
import type {
    TheatreScreenDetailsViewRouteConfig
} from "@domains/screen/_feat/view-data-admin/schemas/TheatreScreenDetailsViewRouteConfigSchema";
import {fetchTheatreScreenDetailsViewData} from "@domains/screen/_feat/view-data-admin/service/service";

/**
 * Controller: Handles the retrieval of layout data and metadata for a specific screen.
 */
export async function getFetchTheatreScreenDetailsViewData(
    req: Request, res: Response
): Promise<Response> {
    const {theatreSlug, screenSlug} = req.parsedConfig as TheatreScreenDetailsViewRouteConfig;

    const data = await fetchTheatreScreenDetailsViewData({theatreSlug, screenSlug});

    return res.status(200).json(data);
}