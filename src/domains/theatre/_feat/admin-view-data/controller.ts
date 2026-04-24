/**
 * @fileoverview Express controllers for the Theatre Admin View Data domain.
 */

import type {Response, Request} from "express";
import type {
    TheatreScreenViewRouteConfig
} from "@domains/theatre/_feat/admin-view-data/schemas/TheatreScreenViewRouteConfigSchema";
import {
    fetchTheatreDetailsViewData,
    fetchTheatreScreenData, fetchTheatreShowingListViewData
} from "@domains/theatre/_feat/admin-view-data/service/service";
import type {
    TheatreDetailsViewRouteConfig
} from "@domains/theatre/_feat/admin-view-data/schemas/TheatreDetailsViewRouteConfigSchema";
import type {
    TheatreShowingListRouteConfig
} from "@domains/theatre/_feat/admin-view-data/schemas/TheatreShowingListRouteConfigSchema";

/**
 * Fetches the physical layout and metadata for a specific theatre screen.
 */
export async function getFetchTheatreScreenViewData(
    req: Request, res: Response
): Promise<Response> {
    const {theatreSlug, screenSlug} = req.parsedConfig as TheatreScreenViewRouteConfig;

    const data = await fetchTheatreScreenData({theatreSlug, screenSlug});

    return res.status(200).json(data);
}

/**
 * Fetches high-level theatre details, including paginated screens and recent showings.
 */
export async function getFetchTheatreDetailsViewData(
    req: Request, res: Response
): Promise<Response> {
    const routeConfig = req.parsedConfig as TheatreDetailsViewRouteConfig;

    const data = await fetchTheatreDetailsViewData(routeConfig);

    return res.status(200).json(data);
}

/**
 * Fetches paginated showings and theatre context for the showing list view.
 */
export async function getFetchTheatreShowingListViewData(
    req: Request, res: Response
): Promise<Response> {
    const routeConfig = req.parsedConfig as TheatreShowingListRouteConfig;

    const data = await fetchTheatreShowingListViewData(routeConfig);

    return res.status(200).json(data);
}