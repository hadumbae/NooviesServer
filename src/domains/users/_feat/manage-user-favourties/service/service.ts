/**
 * @file Service operations for user favourite movies.
 * UserFavouriteService.ts
 */

import type {
    FetchUserFavouritesConfig, IsUserFavouriteMovieReturns,
    ToggleUserFavouriteMovieReturns,
    UserFavouriteMovieConfig
} from "@/domains/users/_feat/manage-user-favourties/service/service.types";

import {User} from "@/domains/users/model/user/User.model";
import createHttpError from "http-errors";
import type {UserSchemaFields} from "@/domains/users/model/user/User.types";
import {Movie} from "@/domains/movie/model/movie/Movie.model";
import {fetchRequiredMovie} from "@/domains/movie/_feat/fetch-movies";


/** Returns paginated favourites for a user. */
export const fetchUserFavourites = async (
    {userID, page, perPage}: FetchUserFavouritesConfig
) => {
    const user = await User.findById(userID).select("favourites").lean();
    if (!user) createHttpError(404, "User not found.");

    const {favourites} = user as UserSchemaFields;
    const [totalItems, items] = await Promise.all([
        Movie.countDocuments({_id: {$in: favourites}}),
        Movie.find({_id: {$in: favourites}})
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
    {userID, movieID}: UserFavouriteMovieConfig
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
    {userID, movieID}: UserFavouriteMovieConfig,
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