/**
 * @fileoverview Express controller for the public Genre details endpoint.
 * Extracts validated request data and invokes the service layer to return
 * aggregated genre and movie information.
 */

import type {Request, Response} from "express";
import type {BrowseGenreWithMoviesRouteParams} from "@domains/genre/_feat/client-view-data/schemas";
import {fetchGenreWithMovies} from "@domains/genre/_feat/client-view-data/service";

/**
 * Handles the GET request for fetching a specific genre and its associated movies.
 */
export async function getFetchGenreWithMovies(req: Request, res: Response): Promise<Response> {
    const {slug, page, perPage} = req.parsedConfig as BrowseGenreWithMoviesRouteParams;
    const data = await fetchGenreWithMovies({slug, moviePagination: {page, perPage}});
    return res.status(200).json(data);
}