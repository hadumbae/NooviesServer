import BaseRepository from "../../../shared/repository/BaseRepository.js";
import Movie from "../model/Movie.js";
import PaginationUtils from "../../../shared/utility/PaginationUtils.js";
import MovieController from "../controller/MovieController.js";
import type IMovie from "../model/IMovie.js";
import {createMovieImageService} from "../service/MovieImageService.js";
import CloudinaryUtils from "../../../shared/utility/CloudinaryUtils.js";

export default class MovieServiceProvider {
    static register() {
        const model = Movie;
        const populateRefs = ["genres", "directors", "cast", "showings"];

        const paginationUtils = PaginationUtils;
        const cloudinaryUtils = CloudinaryUtils;

        const repository = new BaseRepository<IMovie>({model, populateRefs});
        const imageService = createMovieImageService({repository, cloudinaryUtils});

        const controller = new MovieController({repository, paginationUtils, imageService});

        return {
            repository,
            imageService,
            controller,
        }
    }
}