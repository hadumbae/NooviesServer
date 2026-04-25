import type {Request, Response} from "express";
import type {
    TheatreScreenDetailsViewRouteConfig
} from "@domains/screen/_feat/view-data-admin/schemas/TheatreScreenDetailsViewRouteConfigSchema";
import {fetchTheatreScreenDetailsViewData} from "@domains/screen/_feat/view-data-admin/service/service";

/**
 * Fetches the physical layout and metadata for a specific theatre screen.
 */
export async function getFetchTheatreScreenDetailsViewData(
    req: Request, res: Response
): Promise<Response> {
    const {theatreSlug, screenSlug} = req.parsedConfig as TheatreScreenDetailsViewRouteConfig;

    const data = await fetchTheatreScreenDetailsViewData({theatreSlug, screenSlug});

    return res.status(200).json(data);
}