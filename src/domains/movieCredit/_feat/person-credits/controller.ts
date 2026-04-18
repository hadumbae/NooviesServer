/**
 * @fileoverview Controller for handling person filmography and credit statistics requests.
 * * Provides Express handler functions to interface with the movie credit
 * aggregation services.
 */

import type {Request, Response} from "express";
import type {
    FetchPersonCreditStatsRouteConfig,
    FetchPersonFilmographyRouteConfig
} from "@domains/movieCredit/_feat/person-credits/routeSchemas";
import {fetchPersonCreditStats, fetchPersonFilmography} from "@domains/movieCredit/_feat/person-credits/service";

/**
 * Retrieves high-level credit statistics for a person.
 */
export async function getFetchPersonCreditStats(req: Request, res: Response) {
    const {personID} = req.parsedConfig as FetchPersonCreditStatsRouteConfig;
    const data = await fetchPersonCreditStats({personID});
    return res.status(200).json(data);
}

/**
 * Retrieves a person's filmography grouped by production role.
 */
export async function getFetchPersonFilmography(req: Request, res: Response) {
    const {personID, limit} = req.parsedConfig as FetchPersonFilmographyRouteConfig;
    const data = await fetchPersonFilmography({personID, limit});
    return res.status(200).json(data);
}