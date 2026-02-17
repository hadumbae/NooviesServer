/**
 * @file UserFavouriteMovieInputSchema.ts
 * Schema and inferred type for favourite movie input.
 */

import {z} from "zod";
import {ObjectIdSchema} from "../../../shared/schema/mongoose/ObjectIdSchema.js";

/**
 * Validates favourite movie input payload.
 */
export const UserFavouriteMovieInputSchema = z.object({
    movieID: ObjectIdSchema,
});

/**
 * Parsed favourite movie input.
 */
export type UserFavouriteMovieInput = z.infer<typeof UserFavouriteMovieInputSchema>;