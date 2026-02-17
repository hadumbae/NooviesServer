/**
 * @file UserFavouriteService.types.ts
 * Parameter types for user favourite movie operations.
 */

import {Types} from "mongoose";

/**
 * Parameters for fetching paginated favourites.
 */
export type FetchUserFavouritesParams = {
    userID: Types.ObjectId;
    page: number;
    perPage: number;
};

/**
 * Parameters for modifying favourite movies.
 */
export type UserFavouriteMovieParams = {
    userID: Types.ObjectId;
    movieID: Types.ObjectId;
}
