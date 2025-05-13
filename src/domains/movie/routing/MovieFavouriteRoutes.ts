import {Router} from "express";
import MovieServiceProvider from "../provider/MovieServiceProvider.js";
import isAuth from "../../authentication/middleware/isAuth.js";
import asyncHandler from "../../../shared/utility/AsyncHandler.js";

const router = Router();
const {favouriteController} = MovieServiceProvider.register();

router.get(
    "/get/:_id/favourites",
    [isAuth],
    asyncHandler(favouriteController.fetchFavouriteMovieWithShowings.bind(favouriteController)),
);

router.patch(
    "/edit/:_id/favourites/add",
    [isAuth],
    asyncHandler(favouriteController.addToFavourites.bind(favouriteController)),
);

router.patch(
    "/edit/:_id/favourites/remove",
    [isAuth],
    asyncHandler(favouriteController.removeFromFavourites.bind(favouriteController)),
);

export default router;