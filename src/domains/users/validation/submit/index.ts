import {
    type UserFavouriteMovieInput,
    UserFavouriteMovieInputSchema
} from "@domains/users/validation/submit/UserFavouriteMovieInputSchema";
import {
    type UserPasswordUpdateInput,
    UserPasswordUpdateInputSchema
} from "@domains/users/validation/submit/UserPasswordUpdateInputSchema";

export {
    UserFavouriteMovieInputSchema,
    UserPasswordUpdateInputSchema,
}

export type {
    UserFavouriteMovieInput,
    UserPasswordUpdateInput,
}