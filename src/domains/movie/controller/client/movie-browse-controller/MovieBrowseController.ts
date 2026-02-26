/**
 * @file HTTP handlers for browse movie review endpoints.
 * MovieBrowseController.ts
 */

import type {ControllerAsyncFunc} from "../../../../../shared/types/ControllerTypes.js";
import type {Request, Response} from "express";
import isValidObjectId from "../../../../../shared/utility/mongoose/isValidObjectId.js";
import {fetchReviewsByMovie} from "../../../service/browse-movie-details-service/BrowseMovieDetailsService.js";
import QueryUtils from "../../../../../shared/services/query-utils/QueryUtils.js";

/**
 * Returns paginated reviews for a movie.
 */
export const getReviewsByMovie: ControllerAsyncFunc = async (
    req: Request, res: Response
): Promise<Response> => {
    const {movieID: mID} = req.params;
    const movieID = isValidObjectId(mID);

    const {page, perPage} = QueryUtils.fetchPaginationFromQuery(req);
    const options = QueryUtils.fetchOptionsFromQuery(req);

    const data = fetchReviewsByMovie({
        movieID,
        page,
        perPage,
        options,
    })

    return res
        .status(200)
        .json(data)
}