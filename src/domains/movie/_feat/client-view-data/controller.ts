/**
 * @fileoverview Controllers for fetching movie-related data for client-side views.
 *
 */

import type {Request, Response} from "express";
import {fetchRequiredMovie} from "@domains/movie/utilities/fetch/fetchRequiredMovie";
import {MoviePopulationPaths} from "@domains/movie/_feat/query-population";
import {
    fetchCreditsForMovie,
    fetchMovieInfoOverviewViewData,
    fetchShowingsForMovie
} from "src/domains/movie/_feat/client-view-data/service";
import {fetchRequestQueryBySchema} from "@shared/utility/request/fetchRequestQueryBySchema";
import {ShowingsViewQueryStringSchema} from "@domains/showing/schemas/ShowingsViewQueryStringSchema";
import type {
    MovieInfoOverviewViewRouteConfig
} from "src/domains/movie/_feat/client-view-data/schemas/MovieInfoOverviewViewRouteConfigSchema";
import {fetchRequestUser} from "@shared/utility/request/fetchRequestUser";

/**
 * Fetches a movie and its grouped cast and crew credits for browse views.
 */
export async function getFetchGroupedCreditsWithMovie(
    req: Request, res: Response
): Promise<Response> {
    const {slug} = req.params;

    const movie = await fetchRequiredMovie({
        slug, options: {
            populate: true,
            virtuals: true,
            populatePaths: MoviePopulationPaths
        }
    });

    const data = await fetchCreditsForMovie(movie._id);

    return res
        .status(200)
        .json({movie, creditDetails: data});
}

/**
 * Fetches a movie and its associated showtimes based on location and pagination filters.
 */
export async function getFetchShowingsWithMovie(req: Request, res: Response): Promise<Response> {
    const {slug} = req.params;
    const {page, perPage, near, country} = fetchRequestQueryBySchema({
        req,
        schema: ShowingsViewQueryStringSchema,
    })

    const movie = await fetchRequiredMovie({
        slug,
        options: {
            populate: true,
            virtuals: true,
            populatePaths: MoviePopulationPaths
        },
    });

    const showingDetails = await fetchShowingsForMovie({
        movieID: movie._id,
        queries: {
            near,
            page,
            perPage,
            country,
        }
    });

    return res
        .status(200)
        .json({
            movie,
            showingDetails,
        });
}

/** Fetches composite data required for the movie information view. */
export async function getFetchMovieInfoOverviewViewData(req: Request, res: Response): Promise<Response> {
    const userID = fetchRequestUser(req);
    const {slug, reviewPage = 1, reviewPerPage = 3} = req.parsedConfig as MovieInfoOverviewViewRouteConfig;

    const data = await fetchMovieInfoOverviewViewData({
        slug,
        userID,
        reviewPage,
        reviewPerPage,
    });

    return res.status(200).json(data);
}
