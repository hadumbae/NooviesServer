/**
 * @fileoverview Factory and service logic for uploading and replacing movie image assets via Cloudinary.
 */

import {Movie} from "@/domains/movies/_models/movie/Movie.model";
import createHttpError from "http-errors";
import {removeCloudinaryImage} from "@/shared/_feat/manage-cloudinary-images/removeCloudinaryImage";
import {uploadCloudinaryImage} from "@/shared/_feat/manage-cloudinary-images/uploadCloudinaryImage";
import {Types} from "mongoose";
import type {MulterImageFile} from "@/shared/_feat/manage-multer-images";
import type {MovieSchemaFields} from "@/domains/movies";

/** Configuration specifying which image field on the movie document to target. */
type UploaderFactoryConfig = {
    key: "posterImage" | "bannerImage";
}

/** Parameters required to upload a new movie image asset. */
export type MovieImageUploadConfig = {
    movieID: Types.ObjectId;
    image: MulterImageFile;
}

/** Creates an update handler that manages Cloudinary replacement and database persistence for a target image field. */
export function createMovieImageUploader(
    {key}: UploaderFactoryConfig
): (params: MovieImageUploadConfig) => Promise<MovieSchemaFields> {
    return async ({movieID, image}: MovieImageUploadConfig): Promise<MovieSchemaFields> => {
        const movie = await Movie.findById(movieID);
        if (!movie) throw createHttpError(404, "Not found.");

        if (movie[key]) {
            await removeCloudinaryImage({public_id: movie[key].public_id});
        }

        movie[key] = await uploadCloudinaryImage({image});
        await movie.save();

        return movie;
    }
}