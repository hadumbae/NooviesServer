/**
 * @file Authenticated routes for user favourite movie actions.
 * UserProfileRoutes.ts
 */

import {Router} from 'express';
import isAuth from "@/domains/authentication/middleware/isAuth.js";
import asyncHandler from "@/shared/utility/handlers/asyncHandler.js";
import * as UserFavouriteController from "@/domains/users/_feat/manage-user-favourties/controller/controller";
import validateZodSchema from "@/shared/utility/schema/validators/validateZodSchema.js";
import {UserFavouriteMovieInputSchema} from "@/domains/users/validation/submit/UserFavouriteMovieInputSchema";

const router = Router();

/** Lists favourites for the current user. */
router.get(
    "/favourites/user",
    [isAuth],
    asyncHandler(UserFavouriteController.getFavouriteMovies)
);

/** Checks favourite status for a movie. */
router.get(
    "/favourites/check/movie/:movieID",
    [isAuth],
    asyncHandler(UserFavouriteController.getIsFavouriteMovie)
);

/** Toggles favourite state for a movie. */
router.patch(
    "/favourites/toggle",
    [isAuth, validateZodSchema(UserFavouriteMovieInputSchema)],
    asyncHandler(UserFavouriteController.patchToggleUserMovieFavourite)
);

export {
    router as UserFavouritesRoutes,
}