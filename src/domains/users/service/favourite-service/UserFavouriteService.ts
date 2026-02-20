/**
 * @file User favourite movie service operations.
 * UserFavouriteService.ts
 */

import type {FetchUserFavouritesParams, UserFavouriteMovieParams} from "./UserFavouriteService.types.js";
import User from "@models/User.model.js";
import createHttpError from "http-errors";
import type {UserSchemaFields} from "@models/User.types.js";
import MovieModel from "../../../movie/model/Movie.model.js";
import {fetchRequiredMovie} from "../../../movie/service/fetch-service/MovieFetchService.js";

/**
 * Retrieves a paginated list of a user's favourite Movies.
 */
export const fetchUserFavourites = async (
    {userID, page, perPage}: FetchUserFavouritesParams
) => {
    const user = await User.findById(userID).select("favourites").lean();
    if (!user) createHttpError(404, "User not found.");

    const {favourites} = user as UserSchemaFields;
    const [totalItems, items] = await Promise.all([
        MovieModel.countDocuments({_id: {$in: favourites}}),
        MovieModel.find({_id: {$in: favourites}})
            .skip(perPage * (page - 1))
            .limit(perPage)
            .populate("genres")
            .lean(),
    ]);

    return {
        totalItems,
        items,
    };
};

/**
 * Adds a Movie to a user's favourites.
 */
export const addUserFavouriteMovie = async (
    {userID, movieID}: UserFavouriteMovieParams
): Promise<void> => {
    const movie = await fetchRequiredMovie({_id: movieID, options: {lean: true, select: "_id"}});
    await User.findByIdAndUpdate(userID, {$addToSet: {favourites: movie._id}}).orFail();
};

/**
 * Removes a Movie from a user's favourites.
 */
export const removeUserFavouriteMovie = async (
    {userID, movieID}: UserFavouriteMovieParams
): Promise<void> => {
    const movie = await fetchRequiredMovie({_id: movieID, options: {lean: true, select: "_id"}});
    await User.findByIdAndUpdate(userID, {$pull: {favourites: movie._id}}).orFail();
};

/**
 * Checks whether a Movie is in a user's favourites.
 */
export const isUserFavouriteMovie = async (
    {userID, movieID}: UserFavouriteMovieParams
): Promise<boolean> => {
    const isFavourite = await User.exists({_id: userID, favourites: movieID});
    return isFavourite !== null;
};