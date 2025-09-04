import MovieModel from "../model/Movie.model.js";
import type IMovie from "../model/Movie.interface.js";

import MovieController from "../controller/MovieController.js";

import BaseRepository from "../../../shared/repository/BaseRepository.js";
import MovieImageService from "../service/MovieImageService.js";

import MovieService from "../service/movie/MovieService.js";
import MovieQueryOptionService from "../service/MovieQueryOptionService.js";
import MovieFavouriteService from "../service/user/MovieFavouriteService.js";
import MovieFavouriteController from "../controller/MovieFavouriteController.js";
import type {PopulatePath} from "../../../shared/types/PopulatePath.js";
import AggregateQueryService from "../../../shared/services/aggregate/AggregateQueryService.js";

/**
 * Provides all services, controllers, and repositories related to the Movie domain.
 *
 * This class acts as a centralized provider for:
 * - Movie CRUD operations
 * - Movie query options
 * - Movie image handling
 * - Aggregated queries
 * - Movie favourites functionality
 *
 * It follows the Service Provider pattern to register and expose dependencies.
 */
export default class MovieServiceProvider {
    /**
     * Registers and returns all movie-related services, repositories, and controllers.
     *
     * @returns An object containing the following properties:
     * - `repository`: The base repository for Movie entities, with population support.
     * - `imageService`: Service responsible for managing movie images.
     * - `optionService`: Service responsible for handling movie query options.
     * - `favouriteService`: Service responsible for managing user movie favourites.
     * - `crudController`: Controller handling CRUD operations for movies.
     * - `favouriteController`: Controller handling favourite movie operations for users.
     *
     * @example
     * ```ts
     * const movieServices = MovieServiceProvider.register();
     * movieServices.crudController.createMovie({ title: "Inception" });
     * movieServices.favouriteController.addFavourite(userId, movieId);
     * ```
     */
    static register() {
        const model = MovieModel;
        const populateRefs: PopulatePath[] = [
            { path: "genres" },
        ];

        // Repository
        const repository = new BaseRepository<IMovie>({ model, populateRefs });

        // Services
        const service = new MovieService();
        const optionService = new MovieQueryOptionService();
        const imageService = new MovieImageService();
        const aggregateService = new AggregateQueryService({ model, populateRefs });

        // CRUD Controller
        const crudController = new MovieController({
            repository,
            service,
            optionService,
            imageService,
            aggregateService,
        });

        // Favourites Service & Controller
        const favouriteService = new MovieFavouriteService();
        const favouriteController = new MovieFavouriteController({
            optionService,
            favouriteService,
        });

        return {
            repository,
            imageService,
            optionService,
            favouriteService,
            crudController,
            favouriteController,
        };
    }
}