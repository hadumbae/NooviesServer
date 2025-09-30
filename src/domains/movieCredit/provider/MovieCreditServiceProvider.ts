import MovieCredit from "../models/MovieCredit.model.js";
import QueryUtils from "../../../shared/utility/query/QueryUtils.js";
import MovieCreditController from "../controllers/MovieCreditController.js";
import MovieCreditQueryOptionService from "../services/MovieCreditQueryOptionService.js";
import MovieCreditService from "../services/movie-credit-service/MovieCreditService.js";
import AggregateQueryService from "../../../shared/services/aggregate/AggregateQueryService.js";
import MovieCreditRepository from "../repositories/MovieCreditRepository.js";

/**
 * Service provider for the **MovieCredit domain**.
 *
 * This class wires together all dependencies related to `MovieCredit`:
 * - **Model**: Mongoose schema and data access
 * - **Repository**: Handles direct database operations
 * - **Services**: Encapsulate domain logic, query parsing, and aggregation
 * - **Controller**: Exposes endpoints for HTTP routing
 *
 * Designed to be called during application startup to provide a
 * ready-to-use, self-contained package of MovieCredit components.
 */
export default class MovieCreditServiceProvider {
    /**
     * Registers and initializes all MovieCredit-related services.
     *
     * @returns An object with the following properties:
     * - `model`: The {@link MovieCredit} Mongoose model
     * - `repository`: The {@link MovieCreditRepository} for database operations
     * - `crudController`: A configured {@link MovieCreditController} for HTTP routes
     *
     * @example
     * // Register MovieCredit services at startup
     * const { model, repository, crudController } = MovieCreditServiceProvider.register();
     *
     * // Use the repository in domain logic
     * const credit = await repository.findById("123");
     *
     * // Mount controller in an Express app
     * app.use("/movie-credits", crudController.router);
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

        /** Controller for handling HTTP requests and delegating to services */
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
