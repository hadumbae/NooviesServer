/**
 * @file Controller for retrieving showings with the associated movie.
 * @filename getFetchShowingsWithMovie.ts
 */

import type {ControllerAsyncFunc} from "../../../../shared/types/ControllerTypes.js";
import type {Request, Response} from "express";
import {fetchRequiredMovie} from "../../../movie/utilities/fetch/fetchRequiredMovie.js";
import {MoviePopulatePaths} from "../../../movie/queries/MoviePopulatePaths.js";
import {fetchShowingsForMovie} from "../../services/showings-for-movie/ShowingsForMovieService.js";
import {fetchRequestQueryBySchema} from "../../../../shared/utility/request/fetchRequestQueryBySchema.js";
import {
    ShowingsViewQueryStringSchema
} from "../../../movie/schema/view-data/showings-for-movie/ShowingsViewQueryStringSchema.js";

/**
 * Returns a movie with populated showing data.
 */
export const getFetchShowingsWithMovie: ControllerAsyncFunc = async (req: Request, res: Response) => {
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
            populatePaths: MoviePopulatePaths
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
};