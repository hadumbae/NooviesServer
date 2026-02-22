/**
 * @file Handlers for user favourite movie endpoints.
 * UserFavouriteController.ts
 */

import type {Request, Response} from 'express';
import type {ControllerAsyncFunc} from "../../../shared/types/ControllerTypes.js";
import {fetchRequestUser} from "../../../shared/utility/request/fetchRequestUser.js";
import QueryUtils from "../../../shared/services/query-utils/QueryUtils.js";
import * as UserFavouriteService from "../service/favourite-service/UserFavouriteService.js";
import type {UserFavouriteMovieInput} from "../schema/UserFavouriteMovieInputSchema.js";
import isValidObjectId from "../../../shared/utility/mongoose/isValidObjectId.js";

/** Returns paginated favourites for the current user. */
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

/** Indicates whether a movie is favourited by the current user. */
export const getIsFavouriteMovie: ControllerAsyncFunc = async (
    req: Request, res: Response
): Promise<Response> => {
    const userID = fetchRequestUser(req);
    const {movieID} = req.params;

    const mID = isValidObjectId(movieID);
    const isFav = await UserFavouriteService.isUserFavouriteMovie({userID, movieID: mID});

    return res.status(200).json(isFav);
}

/** Toggles the current user's favourite state for a movie. */
export const patchToggleUserMovieFavourite: ControllerAsyncFunc = async (
    req: Request, res: Response
): Promise<Response> => {
    const userID = fetchRequestUser(req);
    const {movieID} = req.validatedBody as UserFavouriteMovieInput;

    const {added, message} = await UserFavouriteService.toggleCurrentUserFavouriteMovie({
        userID,
        movieID,
    });

    return res
        .status(200)
        .json({added, message});
}