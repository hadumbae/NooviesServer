import {
    type UserFavouriteMovieInput,
    UserFavouriteMovieInputSchema
} from "@/domains/users/validation/submit/UserFavouriteMovieInputSchema";
import {
    type UserPasswordUpdateInput,
    UserPasswordUpdateInputSchema
} from "@/domains/authentication/_feat/change-user-password/UserPasswordUpdateInputSchema";

export {
    UserFavouriteMovieInputSchema,
    UserPasswordUpdateInputSchema,
}

export type {
    UserFavouriteMovieInput,
    UserPasswordUpdateInput,
}