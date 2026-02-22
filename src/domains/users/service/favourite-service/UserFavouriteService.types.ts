/**
 * @file Types for user favourite movie service operations.
 * UserFavouriteService.types.ts
 */

import {Types} from "mongoose";

/** Pagination input for favourites retrieval. */
export type FetchUserFavouritesParams = {
    userID: Types.ObjectId;
    page: number;
    perPage: number;
};

/** Identifiers for favourite movie operations. */
export type UserFavouriteMovieParams = {
    userID: Types.ObjectId;
    movieID: Types.ObjectId;
}

/** Result of a toggle favourite operation. */
export type ToggleUserFavouriteMovieReturns = {
    added: boolean;
    message: string;
}