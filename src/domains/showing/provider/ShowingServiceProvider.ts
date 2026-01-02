/**
 * @file ShowingServiceProvider.ts
 *
 * Centralized service provider for the Showing module.
 *
 * @description
 * Acts as a lightweight dependency container responsible for wiring
 * together all Showing-related infrastructure:
 *
 * - Mongoose model and schema lifecycle hooks
 * - Repository and data-access utilities
 * - Query and aggregation services
 * - Domain lifecycle services (e.g. seat-map management)
 * - HTTP controller exposing Showing endpoints
 *
 * This provider contains no business logic and exists solely to
 * construct and register dependencies in a predictable order.
 */

import Showing from "../model/Showing.model.js";
import ShowingController from "../controller/ShowingController.js";
import QueryUtils from "../../../shared/services/query-utils/QueryUtils.js";
import AggregateQueryService from "../../../shared/services/aggregate/AggregateQueryService.js";
import SeatMapService from "../../seatmap/service/seat-map-service/SeatMapService.js";
import ShowingLifestyleService from "../service/lifestyle-service/ShowingLifestyleService.js";
import {ShowingSchema} from "../model/Showing.schema.js";
import ShowingQueryOptionService from "../service/query-option/ShowingQueryOptionService.js";
import ShowingRepository from "../repositories/ShowingRepository.js";

/**
 * Service provider for the Showing domain.
 *
 * @remarks
 * Responsible for:
 * - Registering schema lifecycle middleware
 * - Constructing repositories and services
 * - Wiring dependencies into the HTTP controller
 *
 * This class should be initialized once during application bootstrap.
 */
export default class ShowingServiceProvider {
    /**
     * Registers Showing lifecycle middleware on the schema.
     *
     * @remarks
     * Attaches hooks for side-effectful operations such as:
     * - Seat-map creation on showing creation
     * - Cascading cleanup on showing deletion
     *
     * This method is intentionally separate from {@link register}
     * so that hooks are applied at model import time.
     */
    static registerMiddleware() {
        const seatMapService = new SeatMapService();
        const lifestyleService = new ShowingLifestyleService({seatMapService});

        lifestyleService.registerHooks(ShowingSchema);

        return {
            seatMapService,
            lifestyleService,
        };
    }

    /**
     * Constructs and wires all Showing-related components.
     *
     * @returns Initialized Showing module dependencies.
     *
     * @example
     * ```ts
     * const { controllers } = ShowingServiceProvider.register();
     * app.use("/api/showings", controllers.controller.router);
     * ```
     */
    static register() {
        // --- MODEL ---
        const model = Showing;

        // --- REPOSITORY ---
        const populateRefs = [
            {path: "movie", populate: {path: "genres"}},
            {path: "theatre"},
            {path: "screen"},
        ];

        const repository = new ShowingRepository({populateRefs});

        // --- SERVICES ---
        const queryService = new ShowingQueryOptionService();
        const aggregateService = new AggregateQueryService({model, populateRefs});

        // --- CONTROLLER ---
        const controller = new ShowingController({
            repository,
            queryService,
            queryUtils: QueryUtils,
            aggregateService,
        });

        return {
            model,
            repository,
            services: {
                queryService,
                aggregateService,
            },
            controllers: {
                controller,
            },
        };
    }
}
