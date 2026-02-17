/**
 * @file Controllers for managing user favourite movies.
 */

import type {Request, Response} from 'express';
import type {ControllerAsyncFunc} from "../../../shared/types/ControllerTypes.js";
import {fetchRequestUser} from "../../../shared/utility/request/fetchRequestUser.js";
import QueryUtils from "../../../shared/services/query-utils/QueryUtils.js";
import * as UserFavouriteService from "../service/favourite-service/UserFavouriteService.js";
import type {UserFavouriteMovieInput} from "../schema/UserFavouriteMovieInputSchema.js";

/**
 * Returns paginated favourite movies for the authenticated user.
 */
export const getFavouriteMovies: ControllerAsyncFunc = async (
    req: Request, res: Response
): Promise<Response> => {
    const userID = fetchRequestUser(req);
    const {page, perPage} = QueryUtils.fetchPaginationFromQuery(req);

    const paginatedMovies = await UserFavouriteService.fetchUserFavourites({
        userID,
        page: page ?? 1,
        perPage: perPage ?? 10,
    });

    return res.status(200).json(paginatedMovies);
}

/**
 * Adds a movie to the authenticated user's favourites.
 */
export const patchAddMovieToFavourites: ControllerAsyncFunc = async (
    req: Request, res: Response
): Promise<Response> => {
    const userID = fetchRequestUser(req);
    const {movieID} = req.validatedBody as UserFavouriteMovieInput;

    await UserFavouriteService.addUserFavouriteMovie({userID, movieID});

    return res
        .status(200)
        .json({message: "Movie Added To Favourites."});
}

/**
 * Removes a movie from the authenticated user's favourites.
 */
export const patchRemoveMovieToFavourites: ControllerAsyncFunc = async (
    req: Request, res: Response
): Promise<Response> => {
    const userID = fetchRequestUser(req);
    const {movieID} = req.validatedBody as UserFavouriteMovieInput;

    await UserFavouriteService.removeUserFavouriteMovie({userID, movieID});

    return res
        .status(200)
        .json({message: "Movie Removed From Favourites."});
}
