import createHttpError from "http-errors";
import {type ICloudinaryUtils} from "../../../shared/utility/CloudinaryUtils.js";
import Movie from "../model/Movie.js";
import {Types} from "mongoose";

interface IMovieImageServiceConstructor {
    cloudinaryUtils: ICloudinaryUtils,
}

export interface IMovieImageService {
    cloudinaryUtils: ICloudinaryUtils;
    updateMoviePosterImage(params: {movieID: Types.ObjectId, image: Express.Multer.File}): Promise<any>;
    deleteMoviePosterImage(params: {movieID: Types.ObjectId}): Promise<any>;
}

export default class MovieImageService implements IMovieImageService{
    cloudinaryUtils: ICloudinaryUtils;

    constructor({cloudinaryUtils}: IMovieImageServiceConstructor) {
        this.cloudinaryUtils = cloudinaryUtils;
    }

    async updateMoviePosterImage({movieID, image}: { movieID: Types.ObjectId; image: Express.Multer.File }): Promise<any> {
        const movie = await Movie.findById(movieID);
        if (!movie) throw createHttpError(404, "Not found.");

        if (movie.posterImage) {
            await this.cloudinaryUtils.delete(movie.posterImage.public_id);
        }

        movie.posterImage = await this.cloudinaryUtils.upload(image);
        await movie.save();

        return movie;
    }

    async deleteMoviePosterImage({movieID}: { movieID: Types.ObjectId }): Promise<any> {
        const movie = await Movie.findById({_id: movieID});
        if (!movie) throw createHttpError(404, "Not found.");

        const {_id, posterImage} = movie;

        if (posterImage) {
            await this.cloudinaryUtils.delete(posterImage.public_id);
            return Movie.findByIdAndUpdate(_id, {posterImage: null}, {new: true});
        }

        return movie;
    }
};