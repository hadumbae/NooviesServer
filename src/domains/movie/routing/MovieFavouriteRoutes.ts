import {Router} from "express";
import MovieServiceProvider from "../provider/MovieServiceProvider.js";
import isAuth from "../../authentication/middleware/isAuth.js";
import asyncHandler from "../../../shared/utility/AsyncHandler.js";

const router = Router();
const {favouriteController} = MovieServiceProvider.register();

router.get(
    "/:_id/favourites",
    [isAuth],
    asyncHandler(favouriteController.fetchMovieWithFavourites.bind(favouriteController)),
);

router.patch(
    "/:_id/favourites/add",
    [isAuth],
    asyncHandler(favouriteController.addToFavourites.bind(favouriteController)),
);

router.patch(
    "/:_id/favourites/remove",
    [isAuth],
    asyncHandler(favouriteController.removeFromFavourites.bind(favouriteController)),
);