import { Router } from "express";
import MovieServiceProvider from "../provider/MovieServiceProvider.js";
import isAuth from "../../authentication/middleware/isAuth.js";
import asyncHandler from "../../../shared/utility/handlers/asyncHandler.js";

/**
 * Router instance for Movie favourite-related endpoints.
 */
const router = Router();

/**
 * Destructure the favouriteController from the MovieServiceProvider.
 */
const { controllers: { favouriteController } } = MovieServiceProvider.register();

/**
 * Route: Get favourite movies for a specific user.
 *
 * URL: GET /get/:_id/favourites
 * Middleware:
 * - isAuth → ensures the user is authenticated.
 *
 * Controller method:
 * - fetchFavouriteMovieWithShowings → fetches favourite movies with associated showings.
 */
router.get(
    "/get/:_id/favourites",
    [isAuth],
    asyncHandler(favouriteController.fetchFavouriteMovieWithShowings.bind(favouriteController)),
);

/**
 * Route: Add a movie to a user's favourites.
 *
 * URL: PATCH /edit/:_id/favourites/add
 * Middleware:
 * - isAuth → ensures the user is authenticated.
 *
 * Controller method:
 * - addToFavourites → adds the specified movie to the user's favourites list.
 */
router.patch(
    "/edit/:_id/favourites/add",
    [isAuth],
    asyncHandler(favouriteController.addToFavourites.bind(favouriteController)),
);

/**
 * Route: Remove a movie from a user's favourites.
 *
 * URL: PATCH /edit/:_id/favourites/remove
 * Middleware:
 * - isAuth → ensures the user is authenticated.
 *
 * Controller method:
 * - removeFromFavourites → removes the specified movie from the user's favourites list.
 */
router.patch(
    "/edit/:_id/favourites/remove",
    [isAuth],
    asyncHandler(favouriteController.removeFromFavourites.bind(favouriteController)),
);

export default router;
