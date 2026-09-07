/**
 * @fileoverview Factory for creating image removal functions targeting movie document image fields.
 */

import createHttpError from "http-errors";
import {Types} from "mongoose";
import {Movie, type MovieSchemaFields} from "@/domains/movies/_models/movie";
import {removeCloudinaryImage} from "@/shared/_feat/manage-cloudinary-images";

/** Configuration specifying which image field on the movie document to target for removal. */
type RemoverFactoryConfig = {
    key: "posterImage" | "bannerImage";
}

/** Parameters required to delete a movie image asset. */
export type DeleteMovieImageConfig = {
    movieID: Types.ObjectId
}

/** Creates a function that removes a specified image asset from Cloudinary and clears its database reference. */
export function createMovieImageRemover(
    {key}: RemoverFactoryConfig
): (params: DeleteMovieImageConfig) => Promise<MovieSchemaFields> {
    return async ({movieID}: DeleteMovieImageConfig): Promise<MovieSchemaFields> => {
        const movie = await Movie.findById(movieID);
        if (!movie) throw createHttpError(404, "Not found.");

        if (movie[key] && movie[key].public_id) {
            await removeCloudinaryImage({public_id: movie[key].public_id});
            movie[key] = null;
            await movie.save();
        }

        return movie;
    }
}