/**
 * @file Movie review browse HTTP handlers.
 * MovieBrowseController.ts
 */

import type {ControllerAsyncFunc} from "../../../../../shared/types/ControllerTypes.js";
import type {Request, Response} from "express";
import isValidObjectId from "../../../../../shared/utility/mongoose/isValidObjectId.js";
import * as BrowseMovieDetailsService from "../../../service/browse-movie-details-service/BrowseMovieDetailsService.js";
import QueryUtils from "../../../../../shared/services/query-utils/QueryUtils.js";
import {fetchRequestUser} from "../../../../../shared/utility/request/fetchRequestUser.js";

/**
 * Handles paginated movie review retrieval.
 */
export const getReviewsByMovie: ControllerAsyncFunc = async (
    req: Request, res: Response
): Promise<Response> => {
    const {movieID: mID} = req.params;
    const movieID = isValidObjectId(mID);

    const {page, perPage} = QueryUtils.fetchPaginationFromQuery(req);
    const options = QueryUtils.fetchOptionsFromQuery(req);

    const data = await BrowseMovieDetailsService.fetchReviewsByMovie({
        movieID,
        page,
        perPage,
        options,
    })

    return res
        .status(200)
        .json(data)
}

/**
 * Handles paginated movie review retrieval with aggregate stats
 * and the requesting user's review.
 */
export const getReviewDetailsByMovie: ControllerAsyncFunc = async (
    req: Request, res: Response
): Promise<Response> => {
    const {movieID: mID} = req.params;

    const userID = fetchRequestUser(req);
    const movieID = isValidObjectId(mID);

    const {page, perPage} = QueryUtils.fetchPaginationFromQuery(req);
    const options = QueryUtils.fetchOptionsFromQuery(req);

    const data = await BrowseMovieDetailsService.fetchReviewDetailsByMovie({
        userID,
        movieID,
        page,
        perPage,
        options,
    });

    return res
        .status(200)
        .json(data)
}