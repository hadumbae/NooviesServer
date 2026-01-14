import SeatController from "../controller/SeatController.js";
import SeatQueryOptionService from "../service/SeatQueryOptionService.js";
import QueryUtils from "../../../shared/services/query-utils/QueryUtils.js";
import AggregateQueryService from "../../../shared/services/aggregate/AggregateQueryService.js";
import Seat from "../model/Seat.model.js";
import {SeatPersistenceManager} from "../repositories/managers/SeatPersistenceManager.js";
import {BaseRepository} from "../../../shared/repository/BaseRepository.js";

/**
 * Service provider for the `Seat` domain.
 *
 * This class encapsulates and wires together the model, repository, services,
 * and controllers related to seats. It ensures all dependencies are
 * consistently initialized and can be consumed by routes or other modules.
 *
 * @example
 * ```ts
 * const { model, controllers: {controller} } = SeatServiceProvider.register();
 * app.use("/seats", createBaseRoutes({ crudController: controller }));
 * ```
 */
export default class SeatServiceProvider {
    /**
     * Registers and initializes all components for the `Seat` domain.
     *
     * @returns An object containing:
     * - **model**: The Mongoose `Seat` model.
     * - **repository**: Base repository instance wrapping CRUD logic.
     * - **services**: Supporting services for queries, options, and aggregation.
     * - **controllers**: Seat controller instance that coordinates requests.
     */
    static register() {
        /** The underlying Mongoose model for seats. */
        const model = Seat;

        /** Relations to populate when querying seat documents. */
        const populateRefs = ["theatre", "screen"];

        /** Shared query utilities for building dynamic queries. */
        const queryUtils = QueryUtils;

        const persistenceManager = new SeatPersistenceManager();

        /** Generic repository providing CRUD access to seats. */
        const repository = new BaseRepository({model, populateRefs, persistenceManager});

        /** Service for building and handling query options (e.g., filters, sorting). */
        const optionService = new SeatQueryOptionService();

        /** Aggregation service for executing advanced MongoDB pipelines. */
        const aggregateService = new AggregateQueryService({model, populateRefs});

        /** Controller handling incoming requests and orchestrating services. */
        const controller = new SeatController({
            repository,
            queryUtils,
            optionService,
            aggregateService,
        });

        return {
            model,
            repository,
            services: {
                optionService,
                aggregateService,
            },
            controllers: {
                controller
            },
        };
    }
}
