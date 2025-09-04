import {type Document, Types} from "mongoose";
import type IMovie from "../../model/Movie.interface.js";
import type {DeletePosterImageParams, UploadPosterImageParams} from "../../type/services/MovieImageServiceTypes.js";

/**
 * Interface defining the contract for a movie image service.
 *
 * Provides methods to fetch movies, update poster images, and delete poster images.
 */
export interface IMovieImageService {
    /**
     * Fetches a movie by its ID.
     *
     * @param _id - The MongoDB ObjectId of the movie
     * @returns A promise that resolves to the movie document
     *
     * @example
     * ```ts
     * const movie = await movieImageService.fetchMovie(movieId);
     * console.log(movie.title);
     * ```
     */
    fetchMovie(_id: Types.ObjectId): Promise<IMovie & Document>;

    /**
     * Updates a movie's poster image.
     *
     * If a poster already exists, it will be deleted before uploading the new one.
     *
     * @param params - Parameters required for updating the poster
     * @param params.movieID - The ID of the movie to update
     * @param params.image - The new poster image file (e.g., Express.Multer.File)
     * @returns A promise that resolves to the updated movie document
     *
     * @example
     * ```ts
     * const updatedMovie = await movieImageService.updateMoviePosterImage({
     *   movieID: movieId,
     *   image: req.file
     * });
     * console.log(updatedMovie.posterImage.url);
     * ```
     */
    updateMoviePosterImage(params: UploadPosterImageParams): Promise<IMovie>;

    /**
     * Deletes a movie's poster image.
     *
     * If the movie has a poster image, it will be removed from storage and set to `null` in the document.
     *
     * @param params - Parameters required for deleting the poster
     * @param params.movieID - The ID of the movie
     * @returns A promise that resolves to the updated movie document
     *
     * @example
     * ```ts
     * const updatedMovie = await movieImageService.deleteMoviePosterImage({ movieID: movieId });
     * console.log(updatedMovie.posterImage); // null
     * ```
     */
    deleteMoviePosterImage(params: DeletePosterImageParams): Promise<IMovie>;
}