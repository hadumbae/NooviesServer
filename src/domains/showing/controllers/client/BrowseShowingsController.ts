/**
 * @file Controller for retrieving showings with the associated movie.
 * @filename getFetchShowingsWithMovie.ts
 */

import type {ControllerAsyncFunc} from "../../../../shared/types/ControllerTypes.js";
import type {Request, Response} from "express";
import {fetchRequiredMovie} from "../../../movie/utilities/fetch/fetchRequiredMovie.js";
import {MoviePopulatePaths} from "../../../movie/queries/MoviePopulatePaths.js";

/**
 * Returns a movie with populated showing data.
 */
export const getFetchShowingsWithMovie: ControllerAsyncFunc = async (req: Request, res: Response) => {
    const {slug} = req.params;

    const movie = await fetchRequiredMovie({
        slug,
        options: {
            populate: true,
            virtuals: true,
            populatePaths: MoviePopulatePaths
        }
    });

    return res
        .status(200)
        .json({movie});
};