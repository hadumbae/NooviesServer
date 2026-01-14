import Genre from "../model/Genre.model.js";
import GenreController from "../controller/GenreController.js";
import QueryUtils from "../../../shared/services/query-utils/QueryUtils.js";
import AggregateQueryService from "../../../shared/services/aggregate/AggregateQueryService.js";
import GenreQueryOptionService from "../service/GenreQueryOptionService.js";
import {BaseRepository} from "../../../shared/repository/BaseRepository.js";
import {CRUDWriter} from "../../../shared/repository/operations/CRUDWriter.js";
import {GenrePersistenceManager} from "../repositories/managers/GenrePersistenceManager.js";

/**
 * Service provider for the Genre module.
 *
 * Registers and provides the main components for the Genre domain, including:
 * - Mongoose model
 * - Repository for database operations
 * - Domain services
 * - Controller for handling HTTP requests
 *
 * @remarks
 * This class is a centralized factory for setting up all Genre-related services and controllers.
 * It ensures dependencies are correctly instantiated and wired together.
 *
 * @example
 * ```ts
 * import GenreServiceProvider from './serviceProvider/GenreServiceProvider.js';
 *
 * const { model, repository, services, controllers } = GenreServiceProvider.register();
 * const { genreService } = services;
 * const { controller } = controllers;
 * ```
 */
export default class GenreServiceProvider {
    /**
     * Registers and initializes all components related to the Genre module.
     *
     * @returns An object containing:
     * - `model`: The Mongoose model for Genre.
     * - `repository`: The repository instance for performing database operations.
     * - `services`: An object containing the instantiated services, e.g., `genreService`.
     * - `controllers`: An object containing the instantiated controller, e.g., `controller`.
     */
    static register() {
        const model = Genre;
        const queryUtils = QueryUtils;

        const writer = new CRUDWriter({model, persistenceManager: new GenrePersistenceManager()});
        const repository = new BaseRepository({model, writer});

        const aggregateService = new AggregateQueryService({model});
        const optionService = new GenreQueryOptionService();

        const controller = new GenreController({
            repository,
            queryUtils,
            aggregateService,
            optionService,
        });

        return {
            model,
            repository,
            services: {
                aggregateService,
                optionService,
            },
            controllers: {
                controller
            },
        };
    }
}
