import MovieCredit from "../models/MovieCredit.model.js";
import QueryUtils from "../../../shared/utility/query/QueryUtils.js";
import BaseRepository from "../../../shared/repository/BaseRepository.js";
import MovieCreditController from "../controllers/MovieCreditController.js";
import MovieCreditQueryOptionService from "../services/MovieCreditQueryOptionService.js";
import MovieCreditService from "../services/MovieCreditService.js";
import AggregateQueryService from "../../../shared/services/aggregate/AggregateQueryService.js";
import MovieCreditRepository from "../repositories/MovieCreditRepository.js";

/**
 * Service provider for the MovieCredit domain.
 *
 * Responsible for wiring together the model, repository,
 * services, and controller into a ready-to-use package.
 *
 * Typically called during application startup to register
 * all dependencies related to {@link MovieCredit}.
 */
export default class MovieCreditServiceProvider {
    /**
     * Registers and initializes all MovieCredit-related services.
     *
     * @returns An object containing:
     * - `model`: The {@link MovieCredit} Mongoose model
     * - `repository`: The {@link MovieCreditRepository} instance
     * - `crudController`: A fully configured {@link MovieCreditController}
     *
     * @example
     * const { model, repository, crudController } = MovieCreditServiceProvider.register();
     *
     * // Use repository in domain logic
     * await repository.findById("123");
     *
     * // Use controller in Express routes
     * app.use("/movie-credits", crudController.router);
     */
    static register() {
        const model = MovieCredit;
        const populateRefs = ["person", "movie"];

        // Utility for handling query transformations
        const queryUtils = QueryUtils;

        // Repository for direct database operations
        const repository = new MovieCreditRepository({ model, populateRefs });

        // Domain service for MovieCredit-specific logic
        const service = new MovieCreditService();

        // Service for parsing and applying query options
        const optionService = new MovieCreditQueryOptionService();

        // Aggregation service for advanced MongoDB queries
        const aggregateService = new AggregateQueryService({ model, populateRefs });

        // Controller for handling HTTP requests and delegating to services
        const crudController = new MovieCreditController({
            repository,
            queryUtils,
            service,
            optionService,
            aggregateService,
        });

        return {
            model,
            repository,
            crudController,
        };
    }
}
