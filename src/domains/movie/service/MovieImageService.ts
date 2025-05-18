import createHttpError from "http-errors";
import {type ICloudinaryUtils} from "../../../shared/utility/CloudinaryUtils.js";
import Movie from "../model/Movie.js";
import type BaseRepository from "../../../shared/repository/BaseRepository.js";
import type IMovie from "../model/IMovie.js";

interface IMovieImageServiceConstructor {
    repository: BaseRepository<IMovie>,
    cloudinaryUtils: ICloudinaryUtils,
}

export interface IMovieImageService {
    repository: BaseRepository<IMovie>;
    cloudinaryUtils: ICloudinaryUtils;
    updateMoviePosterImage(params: {movieID: string, image: Express.Multer.File}): Promise<any>;
    deleteMoviePosterImage(params: {movieID: string}): Promise<any>;
}

export default class MovieImageService implements IMovieImageService{
    repository: BaseRepository<IMovie>;
    cloudinaryUtils: ICloudinaryUtils;

    constructor({repository, cloudinaryUtils}: IMovieImageServiceConstructor) {
        this.repository = repository;
        this.cloudinaryUtils = cloudinaryUtils;
    }

    async updateMoviePosterImage({movieID, image}: { movieID: string; image: Express.Multer.File }): Promise<any> {
        const movie = await Movie.findById(movieID);
        if (!movie) throw createHttpError(404, "Not found.");

        if (movie.posterImage) {
            await this.cloudinaryUtils.delete(movie.posterImage.public_id);
        }

        movie.posterImage = await this.cloudinaryUtils.upload(image);
        await movie.save();

        return movie;
    }

    async deleteMoviePosterImage({movieID}: { movieID: string }): Promise<any> {
        const movie = await this.repository.exists404({_id: movieID, virtuals: true});
        const {_id, posterImage} = movie;

        if (posterImage) {
            await this.cloudinaryUtils.delete(posterImage.public_id);
            return this.repository.update({_id, data: {posterImage: null}});
        }

        return movie;
    }
};