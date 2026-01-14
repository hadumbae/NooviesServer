import MovieModel from "../model/Movie.model.js";

import MovieController from "../controller/MovieController.js";
import MovieImageService from "../service/MovieImageService.js";

import MovieService from "../service/movie/MovieService.js";
import MovieQueryOptionService from "../service/MovieQueryOptionService.js";
import MovieFavouriteService from "../service/user/MovieFavouriteService.js";
import MovieFavouriteController from "../controller/MovieFavouriteController.js";
import type { PopulatePath } from "../../../shared/types/mongoose/PopulatePath.js";
import AggregateQueryService from "../../../shared/services/aggregate/AggregateQueryService.js";
import type {MovieSchemaFields} from "../model/Movie.types.js";
import {BaseRepository} from "../../../shared/repository/BaseRepository.js";

/**
 * @class MovieServiceProvider
 * @description
 * Service provider responsible for registering and initializing
 * components related to the Movie entity, including model,
 * repository, services, and controllers.
 */
export default class MovieServiceProvider {
    /**
     * Registers the Movie components and returns an object containing
     * the model, repository, services, and controllers.
     *
     * @static
     * @returns {Object} An object with the following structure:
     * {
     *   model: typeof MovieModel,
     *   repository: BaseRepository<IMovie>,
     *   services: {
     *     imageService: MovieImageService,
     *     optionService: MovieQueryOptionService,
     *     favouriteService: MovieFavouriteService
     *   },
     *   controllers: {
     *     controller: MovieController,
     *     favouriteController: MovieFavouriteController
     *   }
     * }
     */
    static register() {
        // Model representing Movie
        const model = MovieModel;

        // References to populate in queries
        const populateRefs: PopulatePath[] = [
            { path: "genres" },
        ];

        // Repository for Movie with CRUD operations and population options
        const repository = new BaseRepository<MovieSchemaFields>({ model, populateRefs });

        // Core business service for Movie
        const service = new MovieService();

        // Service for handling query options and filters
        const optionService = new MovieQueryOptionService();

        // Service for managing Movie images
        const imageService = new MovieImageService();

        // Service for aggregate queries for Movie
        const aggregateService = new AggregateQueryService({ model, populateRefs });

        // CRUD controller for Movie entity
        const controller = new MovieController({
            repository,
            service,
            optionService,
            imageService,
            aggregateService,
        });

        // Service for handling user favourites for Movies
        const favouriteService = new MovieFavouriteService();

        // Controller for managing Movie favourites
        const favouriteController = new MovieFavouriteController({
            optionService,
            favouriteService,
        });

        return {
            model,
            repository,
            services: {
                imageService,
                optionService,
                favouriteService,
            },
            controllers: {
                controller,
                favouriteController,
            },
        };
    }
}
