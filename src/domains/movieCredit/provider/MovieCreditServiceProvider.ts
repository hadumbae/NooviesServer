import MovieCredit from "../models/MovieCredit.model.js";
import QueryUtils from "../../../shared/services/query-utils/QueryUtils.js";
import MovieCreditController from "../controllers/MovieCreditController.js";
import MovieCreditQueryOptionService from "../services/query-option-service/MovieCreditQueryOptionService.js";
import MovieCreditService from "../services/movie-credit-service/MovieCreditService.js";
import AggregateQueryService from "../../../shared/services/aggregate/AggregateQueryService.js";
import MovieCreditRepository from "../repositories/MovieCreditRepository.js";

/**
 * Service provider for the **MovieCredit domain**.
 *
 * @remarks
 * This class wires together all dependencies related to `MovieCredit`:
 * - **Model**: Mongoose schema and data access.
 * - **Repository**: Handles direct database operations.
 * - **Services**: Encapsulate domain logic, query parsing, and aggregation.
 * - **Controller**: Exposes endpoints for HTTP routing.
 *
 * Designed to be called during application startup to provide a
 * ready-to-use, self-contained package of MovieCredit components.
 */
export default class MovieCreditServiceProvider {
    /**
     * Registers and initializes all MovieCredit-related services.
     *
     * @returns An object containing the fully initialized MovieCredit components:
     * - `model`: The {@link MovieCredit} Mongoose model.
     * - `repository`: The {@link MovieCreditRepository} for direct database operations.
     * - `services`: Encapsulates:
     *   - `service`: {@link MovieCreditService} domain logic.
     *   - `optionService`: {@link MovieCreditQueryOptionService} for parsing queries.
     *   - `aggregateService`: {@link AggregateQueryService} for aggregation pipelines.
     * - `controllers`: Contains the configured {@link MovieCreditController} for HTTP routes.
     *
     * @example
     * // Register MovieCredit services at application startup
     * const { model, repository, services, controllers } = MovieCreditServiceProvider.register();
     *
     * // Using the repository to fetch a credit
     * const credit = await repository.findById("123");
     *
     * // Using the controller in an Express app
     * app.use("/movie-credits", controllers.controller.router);
     */
    static register() {
        /** Mongoose model for MovieCredit */
        const model = MovieCredit;

        /** References to auto-populate when querying MovieCredits */
        const populateRefs = ["person", "movie", "roleType"];

        /** Utility for transforming queries (e.g., filtering, sorting) */
        const queryUtils = QueryUtils;

        /** Repository for database CRUD operations */
        const repository = new MovieCreditRepository({ model, populateRefs });

        /** Service encapsulating MovieCredit domain logic */
        const service = new MovieCreditService();

        /** Service for parsing and applying query options */
        const optionService = new MovieCreditQueryOptionService();

        /** Service for building and executing aggregation pipelines */
        const aggregateService = new AggregateQueryService({ model, populateRefs });

        /** Controller for HTTP endpoints related to MovieCredit */
        const controller = new MovieCreditController({
            repository,
            queryUtils,
            service,
            optionService,
            aggregateService,
        });

        return {
            model,
            repository,
            services: {
                service,
                optionService,
                aggregateService,
            },
            controllers: {
                controller,
            }
        };
    }
}
