/**
 * @fileoverview Controller for aggregating Genre metadata and associated movie data.
 * Designed for administrative and detail views.
 */

import type {Request, Response} from "express";
import {fetchGenreDetails} from "./services/service";
import type {
    GenreDetailsViewRouteConfig
} from "@domains/genre/_feat/admin-view-data/schemas/GenreDetailsViewRouteConfigSchema";

/**
 * Retrieves a detailed view of a Genre, including paginated movie results.
 */
export async function getFetchGenreDetailsViewData(req: Request, res: Response): Promise<Response> {
    const {slug, page, perPage} = req.parsedConfig as GenreDetailsViewRouteConfig;
    const data = await fetchGenreDetails({genreSlug: slug, moviePagination: {page, perPage}});
    return res.status(200).json(data);
}