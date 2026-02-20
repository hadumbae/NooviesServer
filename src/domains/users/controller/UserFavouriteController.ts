/**
 * @file Controllers for user favourite Movie operations.
 * UserFavouriteController.ts
 */

import type { Request, Response } from 'express';
import type { ControllerAsyncFunc } from "../../../shared/types/ControllerTypes.js";
import { fetchRequestUser } from "../../../shared/utility/request/fetchRequestUser.js";
import QueryUtils from "../../../shared/services/query-utils/QueryUtils.js";
import * as UserFavouriteService from "../service/favourite-service/UserFavouriteService.js";
import type { UserFavouriteMovieInput } from "../schema/UserFavouriteMovieInputSchema.js";
import isValidObjectId from "../../../shared/utility/mongoose/isValidObjectId.js";
import { isUserFavouriteMovie } from "../service/favourite-service/UserFavouriteService.js";

/**
 * Returns paginated favourites for the authenticated user.
 *
 * @param req - Express request
 * @param res - Express response
 */
export const getFavouriteMovies: ControllerAsyncFunc = async (
    req: Request, res: Response
): Promise<Response> => {
    const userID = fetchRequestUser(req);
    const { page, perPage } = QueryUtils.fetchPaginationFromQuery(req);

    const paginatedMovies = await UserFavouriteService.fetchUserFavourites({
        userID,
        page: page ?? 1,
        perPage: perPage ?? 10,
    });

    return res.status(200).json(paginatedMovies);
}

/**
 * Adds a Movie to the authenticated user's favourites.
 *
 * @param req - Express request
 * @param res - Express response
 */
export const patchAddMovieToFavourites: ControllerAsyncFunc = async (
    req: Request, res: Response
): Promise<Response> => {
    const userID = fetchRequestUser(req);
    const { movieID } = req.validatedBody as UserFavouriteMovieInput;

    await UserFavouriteService.addUserFavouriteMovie({ userID, movieID });

    return res
        .status(200)
        .json({ message: "Movie Added To Favourites." });
}

/**
 * Removes a Movie from the authenticated user's favourites.
 *
 * @param req - Express request
 * @param res - Express response
 */
export const patchRemoveMovieToFavourites: ControllerAsyncFunc = async (
    req: Request, res: Response
): Promise<Response> => {
    const userID = fetchRequestUser(req);
    const { movieID } = req.validatedBody as UserFavouriteMovieInput;

    await UserFavouriteService.removeUserFavouriteMovie({ userID, movieID });

    return res
        .status(200)
        .json({ message: "Movie Removed From Favourites." });
}

/**
 * Checks if a Movie is favourited by the authenticated user.
 *
 * @param req - Express request
 * @param res - Express response
 */
export const getIsFavouriteMovie: ControllerAsyncFunc = async (
    req: Request, res: Response
): Promise<Response> => {
    const userID = fetchRequestUser(req);
    const { movieID } = req.params;

    const mID = isValidObjectId(movieID);
    const isFav = await isUserFavouriteMovie({ userID, movieID: mID });

    return res.status(200).json(isFav);
}