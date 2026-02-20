/**
 * @file UserProfileRoutes.ts
 * Routes for authenticated user favourite movie actions.
 */

import {Router} from 'express';
import isAuth from "../../authentication/middleware/isAuth.js";
import asyncHandler from "../../../shared/utility/handlers/asyncHandler.js";
import * as UserFavouriteController from "../controller/UserFavouriteController.js";
import validateZodSchema from "../../../shared/utility/schema/validators/validateZodSchema.js";
import {UserFavouriteMovieInputSchema} from "../schema/UserFavouriteMovieInputSchema.js";

const router = Router();

/**
 * Retrieves authenticated user's favourites.
 */
router.get(
    "/favourites/user",
    [isAuth],
    asyncHandler(UserFavouriteController.getFavouriteMovies)
);

router.get(
    "/favourites/check/movie/:movieID",
    [isAuth],
    asyncHandler(UserFavouriteController.getIsFavouriteMovie)
);

/**
 * Adds a movie to favourites.
 */
router.patch(
    "/favourites/add",
    [isAuth, validateZodSchema(UserFavouriteMovieInputSchema)],
    asyncHandler(UserFavouriteController.patchAddMovieToFavourites)
);

/**
 * Removes a movie from favourites.
 */
router.patch(
    "/favourites/remove",
    [isAuth, validateZodSchema(UserFavouriteMovieInputSchema)],
    asyncHandler(UserFavouriteController.patchRemoveMovieToFavourites)
);

export {
    router as UserProfileRoutes,
}
