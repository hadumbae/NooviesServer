/**
 * @fileoverview Controller for handling person filmography requests.
 */

import type { Request, Response } from "express";
import type { FetchPersonFilmographyRouteConfig } from "@domains/movieCredit/_feat/person-credits/routeSchemas";
import { fetchPersonFilmography } from "@domains/movieCredit/_feat/person-credits/service";

/**
 * Retrieves a person's filmography grouped by role.
 */
export async function getFetchPersonFilmography(req: Request, res: Response) {
    const { personID, limit } = req.parsedConfig as FetchPersonFilmographyRouteConfig;
    const data = await fetchPersonFilmography({ personID, limit });
    return res.status(200).json(data);
}