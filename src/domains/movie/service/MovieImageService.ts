import createHttpError from "http-errors";
import type {ICloudinaryUtils} from "../../../shared/utility/CloudinaryUtils.js";
import Movie from "../model/Movie.js";
import type BaseRepository from "../../../shared/repository/BaseRepository.js";
import type IMovie from "../model/IMovie.js";

interface IMovieImageServiceParams {
    repository: BaseRepository<IMovie>,
    cloudinaryUtils: ICloudinaryUtils,
}

export interface IMovieImageService {
    updateMoviePosterImage(params: {movieID: string, image: Express.Multer.File}): Promise<any>;
    deleteMoviePosterImage(params: {movieID: string}): Promise<any>;
}

export const createMovieImageService = (
    { repository, cloudinaryUtils }: IMovieImageServiceParams
): IMovieImageService => ({
    async updateMoviePosterImage({movieID, image}: { movieID: string; image: Express.Multer.File }): Promise<any> {
        const movie = await Movie.findById(movieID);
        if (!movie) throw createHttpError(404, "Not found.");

        if (movie.posterImage) {
            await cloudinaryUtils.delete(movie.posterImage.public_id);
        }

        movie.posterImage = await cloudinaryUtils.upload(image);
        await movie.save();

        return movie;
    },

    async deleteMoviePosterImage({movieID}: { movieID: string }): Promise<any> {
        const movie = await repository.exists404Lean({_id: movieID});
        const {_id, posterImage} = movie;

        if (posterImage) {
            console.log("Image: ", posterImage);
            await cloudinaryUtils.delete(posterImage.public_id);
            return repository.update({_id, data: {posterImage: null}});
        }

        return movie;
    }
});