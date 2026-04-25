/**
 * @fileoverview Express controllers for the Theatre Admin View Data domain.
 */

import type {Request, Response} from "express";
import {
    fetchTheatreDetailsViewData,
    fetchTheatreShowingListViewData
} from "@domains/theatre/_feat/admin-view-data/service/service";
import type {
    TheatreDetailsViewRouteConfig
} from "@domains/theatre/_feat/admin-view-data/schemas/TheatreDetailsViewRouteConfigSchema";
import type {
    TheatreShowingListRouteConfig
} from "@domains/theatre/_feat/admin-view-data/schemas/TheatreShowingListRouteConfigSchema";

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