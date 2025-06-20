import Movie from "../model/Movie.js";
import type IMovie from "../model/IMovie.js";

import MovieController from "../controller/MovieController.js";

import BaseRepository from "../../../shared/repository/BaseRepository.js";
import MovieImageService from "../service/MovieImageService.js";

import CloudinaryUtils from "../../../shared/utility/CloudinaryUtils.js";
import QueryUtils from "../../../shared/utility/query/QueryUtils.js";
import MovieService from "../service/MovieService.js";
import MovieQueryService from "../service/MovieQueryService.js";
import MovieFavouriteService from "../service/user/MovieFavouriteService.js";
import MovieFavouriteController from "../controller/MovieFavouriteController.js";
import type {PopulatePath} from "../../../shared/types/PopulatePath.js";
import AggregateQueryService from "../../../shared/services/aggregate/AggregateQueryService.js";

export default class MovieServiceProvider {
    static register() {
        const model = Movie;
        const populateRefs: PopulatePath[] = [
            {path: "genres"},
            {path: "showings"},
            {path: "crew", populate: {path: "person"}},
            {path: "cast", populate: {path: "person"}},
        ];

        const queryUtils = QueryUtils;
        const cloudinaryUtils = new CloudinaryUtils();

        const repository = new BaseRepository<IMovie>({model, populateRefs});

        const service = new MovieService();
        const queryService = new MovieQueryService();
        const favouriteService = new MovieFavouriteService();
        const imageService = new MovieImageService({cloudinaryUtils});
        const aggregateService = new AggregateQueryService({model, populateRefs});

        const crudController = new MovieController({
            repository,
            queryUtils,
            service,
            queryService,
            imageService,
            aggregateService,
        });

        const favouriteController = new MovieFavouriteController({
            queryUtils,
            queryService,
            favouriteService,
        });

        return {
            repository,

            imageService,
            queryService,
            favouriteService,

            crudController,
            favouriteController,
        }
    }
}