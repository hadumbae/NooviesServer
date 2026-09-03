/**
 * @fileoverview Express controller for fetching theatre and showing data filtered by geographic location.
 */

import type { Request, Response } from "express";
import type {
    TheatresByLocationRouteConfig
} from "@/domains/theatre/_feat/search-theatres/fetch-by-location/TheatresByLocationRouteConfigSchema";
import {fetchTheatresByLocation} from "@/domains/theatre/_feat/search-theatres/fetch-by-location/fetchTheatresByLocation";

/**
 * Handles incoming requests to retrieve theatres and their upcoming showings based on location and pagination parameters.
 */
export async function getFetchTheatresByLocation(req: Request, res: Response): Promise<Response> {
    const { target, country, limit, page, perPage } = req.parsedConfig as TheatresByLocationRouteConfig;
    const data = await fetchTheatresByLocation({ target, country, page, perPage, limit });
    return res.status(200).json(data);
}