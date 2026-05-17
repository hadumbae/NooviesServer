/**
 * @file Movie review browse HTTP handlers.
 * MovieBrowseController.ts
 */

import type {Request, Response} from "express";
import isValidObjectId from "@shared/utility/mongoose/isValidObjectId";
import QueryUtils from "@shared/services/query-utils/QueryUtils";
import {fetchRequestUser} from "@shared/utility/request/fetchRequestUser";
import * as BrowseMovieDetailsService
    from "src/domains/movie/_feat/fetch-reviews-by-movie/service";

/**
 * Handles paginated movie review retrieval.
 */
export async function getReviewsByMovie(
    req: Request, res: Response
): Promise<Response> {
    const {_id} = req.params;
    const movieID = isValidObjectId(_id);

    const {page, perPage} = QueryUtils.fetchPaginationFromQuery(req);
    const options = QueryUtils.fetchOptionsFromQuery(req);

    const data = await BrowseMovieDetailsService.fetchPaginatedReviewsByMovie({
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
 * Returns featured reviews for a movie and the requesting user's review.
 */
export async function getFeaturedReviewsByMovie(
    req: Request, res: Response
): Promise<Response> {
    const {_id} = req.params;

    const userID = fetchRequestUser(req);
    const movieID = isValidObjectId(_id);
    const options = QueryUtils.fetchOptionsFromQuery(req);

    const data = await BrowseMovieDetailsService.fetchFeaturedReviewsByMovie({
        movieID,
        userID,
        options,
    });

    return res.status(200).json(data)
}

/**
 * Handles paginated movie review retrieval with aggregate stats
 * and the requesting user's review.
 */
export async function getReviewDetailsByMovie(
    req: Request, res: Response
): Promise<Response> {
    const {_id} = req.params;

    const userID = fetchRequestUser(req);
    const movieID = isValidObjectId(_id);

    console.log("MovieID : ", movieID);

    const {page, perPage} = QueryUtils.fetchPaginationFromQuery(req);
    const options = QueryUtils.fetchOptionsFromQuery(req);

    const data = await BrowseMovieDetailsService.fetchReviewDetailsForMovie({
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