/**
 * @fileoverview Express controllers for the Theatre Admin View Data domain.
 * Maps parsed route configurations to service layer calls for data aggregation.
 */

import type { Response, Request } from "express";
import type {
    TheatreScreenViewRouteConfig
} from "@domains/theatre/_feat/admin-view-data/schemas/TheatreScreenViewRouteConfigSchema";
import {
    fetchTheatreDetailsViewData,
    fetchTheatreScreenData
} from "@domains/theatre/_feat/admin-view-data/service/service";
import type {
    TheatreDetailsViewRouteConfig
} from "@domains/theatre/_feat/admin-view-data/schemas/TheatreDetailsViewRouteConfigSchema";

/**
 * Controller to fetch the physical layout and metadata for a specific theatre screen.
 */
export async function getFetchTheatreScreenViewData(
    req: Request, res: Response
): Promise<Response> {
    const { theatreSlug, screenSlug } = req.parsedConfig as TheatreScreenViewRouteConfig;

    const data = await fetchTheatreScreenData({ theatreSlug, screenSlug });

    return res.status(200).json(data);
}

/**
 * Controller to fetch the high-level details of a theatre, including
 * paginated screens and recent showings.
 */
export async function getFetchTheatreDetailsViewData(
    req: Request, res: Response
): Promise<Response> {
    const routeConfig = req.parsedConfig as TheatreDetailsViewRouteConfig;

    const data = await fetchTheatreDetailsViewData(routeConfig);

    return res.status(200).json(data);
}