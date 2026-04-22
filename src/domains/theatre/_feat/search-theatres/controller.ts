/**
 * @fileoverview Express controller for fetching theatre and showing data filtered by geographic location.
 */

import type { Request, Response } from "express";
import { fetchTheatresByLocation } from "@domains/theatre/_feat/search-theatres/service/service";
import type {
    TheatresByLocationRouteConfig
} from "@domains/theatre/_feat/search-theatres/schemas/TheatresByLocationRouteConfigSchema";

/**
 * Handles incoming requests to retrieve theatres and their upcoming showings based on location and pagination parameters.
 */
export async function getFetchTheatresByLocation(req: Request, res: Response): Promise<Response> {
    const { target, limit, page, perPage } = req.parsedConfig as TheatresByLocationRouteConfig;
    const data = await fetchTheatresByLocation({ target, page, perPage, limit });
    return res.status(200).json(data);
}