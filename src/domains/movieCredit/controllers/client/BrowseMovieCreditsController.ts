/**
 * @file Handles frontend requests for grouped movie credits with movie details.
 * @filename BrowseMovieCreditsController.ts
 */

import type {ControllerAsyncFunc} from "../../../../shared/types/ControllerTypes.js";
import type {Request, Response} from "express";
import {fetchRequiredMovie} from "../../../movie/utilities/fetch/fetchRequiredMovie.js";
import {fetchCreditsForMovie} from "../../services/credits-for-movie/CreditsForMovieService.js";
import {MoviePopulatePaths} from "../../../movie/queries/MoviePopulatePaths.js";

/**
 * Fetches a movie and its grouped cast and crew credits for browse views.
 */
export const getFetchGroupedCreditsWithMovie: ControllerAsyncFunc = async (
    req: Request, res: Response
) => {
    const {slug} = req.params;

    const movie = await fetchRequiredMovie({
        slug, options: {
            populate: true,
            virtuals: true,
            populatePaths: MoviePopulatePaths
        }
    });

    const data = await fetchCreditsForMovie(movie._id);

    return res
        .status(200)
        .json({movie, creditDetails: data});
}