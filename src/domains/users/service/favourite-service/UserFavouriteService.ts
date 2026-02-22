/**
 * @file Service operations for user favourite movies.
 * UserFavouriteService.ts
 */

import type {
    FetchUserFavouritesParams, IsUserFavouriteMovieReturns,
    ToggleUserFavouriteMovieReturns,
    UserFavouriteMovieParams
} from "./UserFavouriteService.types.js";
import User from "@models/User.model.js";
import createHttpError from "http-errors";
import type {UserSchemaFields} from "@models/User.types.js";
import MovieModel from "../../../movie/model/Movie.model.js";
import {fetchRequiredMovie} from "../../../movie/service/fetch-service/MovieFetchService.js";

/** Returns paginated favourites for a user. */
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

/** Determines if a movie is favourited by a user. */
export const isUserFavouriteMovie = async (
    {userID, movieID}: UserFavouriteMovieParams
): Promise<IsUserFavouriteMovieReturns> => {
    const checkValue = await User.exists({_id: userID, favourites: movieID});
    const isFavourite = checkValue !== null

    return {
        isFavourite,
        message: isFavourite
            ? "Movie is a favourite."
            : "Movie is not a favourite.",
    };
};

/** Toggles a movie in the user's favourites. */
export const toggleCurrentUserFavouriteMovie = async (
    {userID, movieID}: UserFavouriteMovieParams,
): Promise<ToggleUserFavouriteMovieReturns> => {
    const movie = await fetchRequiredMovie({
        _id: movieID,
        options: {lean: true, select: "_id"}
    });

    const removed = await User.findOneAndUpdate(
        {_id: userID, favourites: movie._id},
        {$pull: {favourites: movie._id}},
        {new: true}
    );

    if (removed) {
        return {
            added: false,
            message: "Movie removed from favourites.",
        };
    }

    const addedCount = await User.updateOne(
        {_id: userID},
        {$addToSet: {favourites: movie._id}},
    );

    if (addedCount.matchedCount === 0) {
        throw createHttpError(404, "User not found.");
    }

    return {
        added: true,
        message: "Movie added to favourites.",
    };
}