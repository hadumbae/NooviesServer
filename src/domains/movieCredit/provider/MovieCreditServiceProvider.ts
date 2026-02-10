import MovieCredit from "../models/MovieCredit.model.js";
import QueryUtils from "../../../shared/services/query-utils/QueryUtils.js";
import MovieCreditController from "../controllers/MovieCreditController.js";
import MovieCreditQueryOptionService from "../services/query-option-service/MovieCreditQueryOptionService.js";
import MovieCreditService from "../services/movie-credit-service/MovieCreditService.js";
import AggregateQueryService from "../../../shared/services/aggregate/AggregateQueryService.js";
import {CRUDWriter} from "../../../shared/repository/operations/CRUDWriter.js";
import {MovieCreditPersistenceManager} from "../repositories/managers/MovieCreditPersistenceManager.js";
import {BaseRepository} from "../../../shared/repository/BaseRepository.js";

/**
 * @file MovieCreditServiceProvider.ts
 *
 * Service provider for the MovieCredit domain.
 *
 * Responsible for wiring together persistence, domain services,
 * query utilities, and HTTP controllers.
 */

/**
 * MovieCredit module service provider.
 *
 * Acts as a centralized factory for initializing all MovieCredit
 * infrastructure and application-layer components.
 */
export default class MovieCreditServiceProvider {
    /**
     * Registers and initializes the MovieCredit module.
     *
     * @returns Initialized MovieCredit components
     *
     * @example
     * ```ts
     * const { model, repository, services, controllers } =
     *   MovieCreditServiceProvider.register();
     * ```
     */
    static register() {
        /** Mongoose model */
        const model = MovieCredit;

        /** References auto-populated on MovieCredit queries */
        const populateRefs = ["person", "movie", "roleType"];

        /** Query transformation utilities */
        const queryUtils = QueryUtils;

        const writer = new CRUDWriter({
            model,
            populateRefs,
            persistenceManager: new MovieCreditPersistenceManager(),
        });

        /** Repository for MovieCredit persistence */
        const repository = new BaseRepository({model, populateRefs, writer});

        /** Domain service for MovieCredit business logic */
        const service = new MovieCreditService();

        /** Query option parsing service */
        const optionService = new MovieCreditQueryOptionService();

        /** Aggregation pipeline service */
        const aggregateService = new AggregateQueryService({model});

        /** HTTP controller */
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
            },
        };
    }
}
