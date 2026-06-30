/**
 * @fileoverview Controllers for fetching movie-related data for client-side views.
 *
 */

import type {Request, Response} from "express";
import {MoviePopulationPaths} from "@/domains/movies/_feat/query-population";
import {fetchRequestUser} from "@/shared/utility/request/fetchRequestUser";
import type {
    MovieInfoCreditsViewRouteConfig
} from "@/domains/movies/_feat/client-view-data/schemas/MovieInfoCreditsViewRouteConfigSchema";
import type {
    MovieInfoShowingsViewRouteConfig
} from "@/domains/movies/_feat/client-view-data/schemas/MovieInfoShowingsViewRouteConfigSchema";
import {fetchShowingsForMovie} from "@/domains/movies/_feat/client-view-data/utils/fetchShowingsForMovie";
import {
    fetchMovieInfoCreditsViewData,
    fetchMovieInfoOverviewViewData
} from "@/domains/movies/_feat/client-view-data/utils";
import type {
    MovieInfoOverviewViewRouteConfig
} from "@/domains/movies/_feat/client-view-data/schemas/MovieInfoOverviewViewRouteConfigSchema";
import {fetchRequiredMovie} from "@/domains/movies/_feat/fetch-movies";

/**
 * Fetches a movie and its grouped cast and crew credits for browse views.
 */
export async function getFetchMovieInfoCreditsViewData(
    req: Request, res: Response
): Promise<Response> {
    const {slug} = req.parsedConfig as MovieInfoCreditsViewRouteConfig;

    const data = await fetchMovieInfoCreditsViewData({slug});

    return res
        .status(200)
        .json(data);
}

/**
 * Fetches a movie and its associated showtimes based on location and pagination filters.
 */
export async function getFetchMovieInfoShowingsViewData(req: Request, res: Response): Promise<Response> {
    const {slug, near, page, perPage, country} = req.parsedConfig as MovieInfoShowingsViewRouteConfig;

    const movie = await fetchRequiredMovie({
        slug, options: {
            populate: true,
            virtuals: true,
            populatePaths: MoviePopulationPaths
        }
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
