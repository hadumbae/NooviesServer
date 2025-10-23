import createHttpError from "http-errors";
import CloudinaryUtils from "../../../shared/utility/cloudinary/CloudinaryUtils.js";
import MovieModel from "../model/Movie.model.js";
import {type Document, Types} from "mongoose";
import type IMovie from "../model/Movie.interface.js";
import type {IMovieImageService} from "../interface/service/IMovieImageService.js";
import type {DeletePosterImageParams, UploadPosterImageParams} from "../type/services/MovieImageServiceTypes.js";

/**
 * Service for handling movie poster images.
 *
 * Provides methods to fetch movies, upload new poster images, and delete existing ones.
 * Utilizes Cloudinary for image storage.
 */
export default class MovieImageService implements IMovieImageService {
    /**
     * Fetches a movie by its ID.
     *
     * @param movieID - The MongoDB ObjectId of the movie
     * @returns The movie document
     * @throws 404 HTTP error if the movie is not found
     */
    async fetchMovie(movieID: Types.ObjectId): Promise<IMovie & Document> {
        const movie = await MovieModel.findById(movieID);
        if (!movie) throw createHttpError(404, "Not found.");
        return movie;
    }

    /**
     * Updates a movie's poster image.
     *
     * If a poster image already exists, it will be deleted from Cloudinary before uploading the new one.
     *
     * @param params - Parameters for updating the poster image
     * @param params.movieID - The ID of the movie to update
     * @param params.image - The new poster image file (Express.Multer.File)
     * @returns The updated movie document
     */
    async updateMoviePosterImage(params: UploadPosterImageParams): Promise<IMovie> {
        const { movieID, image } = params;
        const movie = await this.fetchMovie(movieID);

        if (movie.posterImage) {
            await CloudinaryUtils.delete(movie.posterImage.public_id);
        }

        movie.posterImage = await CloudinaryUtils.upload(image);
        await movie.save();

        return movie;
    }

    /**
     * Deletes a movie's poster image.
     *
     * If the movie has a poster image, it will be removed from Cloudinary and set to null in the movie document.
     *
     * @param params - Parameters for deleting the poster image
     * @param params.movieID - The ID of the movie
     * @returns The updated movie document
     */
    async deleteMoviePosterImage(params: DeletePosterImageParams): Promise<IMovie> {
        const { movieID } = params;
        const movie = await this.fetchMovie(movieID);

        const { posterImage } = movie;

        if (posterImage) {
            await CloudinaryUtils.delete(posterImage.public_id);
            movie.posterImage = null;
            await movie.save();
        }

        return movie;
    }
}