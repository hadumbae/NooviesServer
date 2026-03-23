/**
 * @file Express controller for fetching aggregated Genre details and associated movies.
 * @filename GenreAdminViewDataController.ts
 */

import type {ControllerAsyncFunc} from "../../../../shared/types/ControllerTypes.js";
import type {Request, Response} from "express";
import QueryUtils from "../../../../shared/services/query-utils/QueryUtils.js";
import {fetchGenreDetails} from "../../services/views/GenreViewDataService.js";

/**
 * Handles the HTTP request to retrieve a comprehensive Genre data package.
 * @param req - The Express request object.
 * @param res - The Express response object.
 */
export const getFetchGenreDetailsVeiwData: ControllerAsyncFunc = async (
    req: Request, res: Response
) => {
    const {slug} = req.params;
    const {page, perPage} = QueryUtils.fetchPaginationFromQuery(req);

    const data = await fetchGenreDetails({
        genreSlug: slug,
        moviePagination: {page, perPage},
    });

    return res.status(200).json(data)
}