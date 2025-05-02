import Movie from "../model/Movie.js";
import type IMovie from "../model/IMovie.js";

import MovieController from "../controller/MovieController.js";

import BaseRepository from "../../../shared/repository/BaseRepository.js";
import MovieImageService from "../service/MovieImageService.js";

import CloudinaryUtils from "../../../shared/utility/CloudinaryUtils.js";
import QueryUtils from "../../../shared/utility/query/QueryUtils.js";
import MovieService from "../service/MovieService.js";
import MovieQueryService from "../service/MovieQueryService.js";

export default class MovieServiceProvider {
    static register() {
        const model = Movie;
        const populateRefs = ["genres", "directors", "cast", "showings"];

        const queryUtils = QueryUtils;
        const cloudinaryUtils = CloudinaryUtils;

        const service = new MovieService();
        const queryService = new MovieQueryService();

        const repository = new BaseRepository<IMovie>({model, populateRefs});
        const imageService = new MovieImageService({repository, cloudinaryUtils});

        const controller = new MovieController({
            repository,
            queryUtils,
            service,
            queryService,
            imageService,
        });

        return {
            repository,
            imageService,
            controller,
        }
    }
}