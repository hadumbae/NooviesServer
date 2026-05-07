/**
 * @fileoverview Service for handling movie poster images using Cloudinary for storage and management.
 */

import createHttpError from "http-errors";
import MovieModel from "../model/Movie.model.js";
import {type Document, Types} from "mongoose";
import type {IMovieImageService} from "../interface/service/IMovieImageService.js";
import type {DeletePosterImageParams, UploadPosterImageParams} from "../type/services/MovieImageServiceTypes.js";
import type {MovieSchemaFields} from "../model/Movie.types.js";
import {removeCloudinaryImage, uploadCloudinaryImage} from "@shared/_feat/manage-cloudinary-images";

/**
 * Service for handling movie poster images.
 */
export default class MovieImageService implements IMovieImageService {
    /**
     * Fetches a movie by its ID.
     */
    async fetchMovie(movieID: Types.ObjectId): Promise<MovieSchemaFields & Document> {
        const movie = await MovieModel.findById(movieID);
        if (!movie) throw createHttpError(404, "Not found.");
        return movie;
    }

    /**
     * Updates a movie's poster image.
     */
    async updateMoviePosterImage(params: UploadPosterImageParams): Promise<MovieSchemaFields> {
        const {movieID, image} = params;
        const movie = await this.fetchMovie(movieID);

        if (movie.posterImage) {
            await removeCloudinaryImage({public_id: movie.posterImage.public_id});
        }

        movie.posterImage = await uploadCloudinaryImage({image});
        await movie.save();

        return movie;
    }

    /**
     * Deletes a movie's poster image.
     */
    async deleteMoviePosterImage(params: DeletePosterImageParams): Promise<MovieSchemaFields> {
        const {movieID} = params;
        const movie = await this.fetchMovie(movieID);

        const {posterImage} = movie;

        if (posterImage) {
            await removeCloudinaryImage({public_id: posterImage.public_id});
            movie.posterImage = null;
            await movie.save();
        }

        return movie;
    }
}