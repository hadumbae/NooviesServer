/**
 * @fileoverview Service for managing movie poster image uploads and deletions in Cloudinary.
 */

import type {MovieSchemaFields} from "@domains/movie/model/Movie.types";
import MovieModel from "@domains/movie/model/Movie.model";
import createHttpError from "http-errors";
import {removeCloudinaryImage, uploadCloudinaryImage} from "@shared/_feat/manage-cloudinary-images";
import type {DeletePosterImageConfig, UploadPosterImageConfig} from "@domains/movie/_feat/manage-image/service.types";

/** Replaces a movie's current poster image with a new upload and removes the old asset. */
export async function updateMoviePosterImage(
    {movieID, image}: UploadPosterImageConfig
): Promise<MovieSchemaFields> {
    const movie = await MovieModel.findById(movieID);
    if (!movie) throw createHttpError(404, "Not found.");

    if (movie.posterImage) {
        await removeCloudinaryImage({public_id: movie.posterImage.public_id});
    }

    movie.posterImage = await uploadCloudinaryImage({image});
    await movie.save();

    return movie;
}

/** Deletes a movie's poster image from Cloudinary and clears the reference in the database. */
export async function removeMoviePosterImage(
    {movieID}: DeletePosterImageConfig
): Promise<MovieSchemaFields> {
    const movie = await MovieModel.findById(movieID);
    if (!movie) throw createHttpError(404, "Not found.");

    const {posterImage} = movie;

    if (posterImage) {
        await removeCloudinaryImage({public_id: posterImage.public_id});
        movie.posterImage = null;
        await movie.save();
    }

    return movie;
}