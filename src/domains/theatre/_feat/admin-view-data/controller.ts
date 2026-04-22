/**
 * @fileoverview Express controller handler for fetching aggregated theatre and screen data.
 */

import type { Response, Request } from "express";
import type {
    TheatreScreenViewRouteConfig
} from "@domains/theatre/_feat/admin-view-data/schemas/TheatreScreenViewRouteConfigSchema";
import { fetchTheatreScreenData } from "@domains/theatre/_feat/admin-view-data/service/service";

/**
 * Retrieves theatre, screen, and seat details using parsed route configuration and returns a JSON response.
 */
export async function getFetchTheatreScreenViewData(
    req: Request, res: Response
): Promise<Response> {
    const { theatreSlug, screenSlug } = req.parsedConfig as TheatreScreenViewRouteConfig;
    const data = await fetchTheatreScreenData({ theatreSlug, screenSlug });
    return res.status(200).json(data);
}