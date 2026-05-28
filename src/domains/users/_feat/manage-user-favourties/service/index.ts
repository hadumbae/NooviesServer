import type {
    FetchUserFavouritesConfig,
    IsUserFavouriteMovieReturns,
    ToggleUserFavouriteMovieReturns,
    UserFavouriteMovieConfig
} from "@domains/users/_feat/manage-user-favourties/service/service.types";
import {
    fetchUserFavourites,
    isUserFavouriteMovie,
    toggleCurrentUserFavouriteMovie
} from "@domains/users/_feat/manage-user-favourties/service/service";

export {
    fetchUserFavourites,
    isUserFavouriteMovie,
    toggleCurrentUserFavouriteMovie,
}

export type {
    FetchUserFavouritesConfig,
    UserFavouriteMovieConfig,
    IsUserFavouriteMovieReturns,
    ToggleUserFavouriteMovieReturns,
}

