import createHttpError from "http-errors";
import CloudinaryUtils from "../../../shared/utility/CloudinaryUtils.js";
import MovieModel from "../model/Movie.model.js";
import {type Document, Types} from "mongoose";
import type IMovie from "../model/Movie.interface.js";
import type {ZMovie} from "../schema/MovieSchema.js";
import type {IMovieImageService} from "../interface/service/IMovieImageService.js";
import type {
    DeletePosterImageParams,
    UploadPosterImageParams
} from "../type/services/MovieImageServiceTypes.js";

export default class MovieImageService implements IMovieImageService {
    private cloudinaryUtils: CloudinaryUtils;

    constructor({cloudinaryUtils}: { cloudinaryUtils: CloudinaryUtils }) {
        this.cloudinaryUtils = cloudinaryUtils;
    }

    async fetchMovie(movieID: Types.ObjectId): Promise<IMovie & Document> {
        const movie = await MovieModel.findById(movieID);
        if (!movie) throw createHttpError(404, "Not found.");
        return movie;
    }

    async updateMoviePosterImage(params: UploadPosterImageParams): Promise<ZMovie> {
        const {movieID, image} = params;
        const movie = await this.fetchMovie(movieID);

        if (movie.posterImage) {
            await this.cloudinaryUtils.delete(movie.posterImage.public_id);
        }

        movie.posterImage = await this.cloudinaryUtils.upload(image);
        await movie.save();

        return movie;
    }

    async deleteMoviePosterImage(params: DeletePosterImageParams): Promise<ZMovie> {
        const {movieID} = params;
        const movie = await this.fetchMovie(movieID);

        const {posterImage} = movie;

        if (posterImage) {
            await this.cloudinaryUtils.delete(posterImage.public_id);
            movie.posterImage = null;
            await movie.save();
        }

        return movie;
    }
};