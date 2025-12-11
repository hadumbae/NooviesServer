/**
 * @file ShowingServiceProvider.ts
 * @description
 * Centralized service provider for all Showing-related components.
 *
 * This provider wires together:
 * - The Mongoose Showing model.
 * - Repository and data-access utilities.
 * - CRUD, query, and aggregation services.
 * - Lifecycle middleware (e.g., seat-map creation and cleanup).
 * - The Showing controller for HTTP routing.
 *
 * By exposing a single static {@link register} method, the provider acts as a
 * lightweight dependency-injection container for the Showings module.
 */

import Showing from "../model/Showing.model.js";
import BaseRepository from "../../../shared/repository/BaseRepository.js";
import ShowingController from "../controller/ShowingController.js";
import QueryUtils from "../../../shared/services/query-utils/QueryUtils.js";
import ShowingQueryService from "../service/ShowingQueryService.js";
import AggregateQueryService from "../../../shared/services/aggregate/AggregateQueryService.js";
import ShowingCRUDService from "../service/ShowingCRUDService.js";
import SeatMapService from "../../seatmap/service/seat-map-service/SeatMapService.js";
import ShowingLifestyleService from "../service/lifestyle-service/ShowingLifestyleService.js";
import {ShowingSchema} from "../model/Showing.schema.js";

/**
 * Registers all Showing-related services, repository layers, middleware, and controllers.
 *
 * @remarks
 * This class exists as a convenience bootstrapper for the Showings module.
 * It centralizes construction of every component that depends on the Showing model:
 *
 * - Repository setup with default populate paths.
 * - CRUD, query, and aggregation services.
 * - Lifecycle middleware that manages seat-map creation and cleanup.
 * - The HTTP controller exposing all Showing endpoints.
 *
 * @example
 * ```ts
 * const { controllers } = ShowingServiceProvider.register();
 * app.use("/api/showings", controllers.controller.router);
 * ```
 */
export default class ShowingServiceProvider {
    /**
     * Initialize and bind all Showing components.
     *
     * @returns Object containing:
     *
     * - **model**: Mongoose Showing model.
     * - **repository**: Configured `BaseRepository`.
     * - **services**:
     *   - `crudService`: Create/update logic with validations.
     *   - `queryService`: Filtering and list utilities.
     *   - `aggregateService`: Analytics and aggregation pipelines.
     * - **controllers**:
     *   - `controller`: Main HTTP controller for CRUD and query endpoints.
     */
    static register() {
        // --- Model ---
        const model = Showing;

        // --- Repository ---
        const populateRefs = [
            {path: "movie", populate: {path: "genres"}},
            {path: "theatre"},
            {path: "screen"},
        ];

        const repository = new BaseRepository({model, populateRefs});

        // --- Query Utils ---
        const queryUtils = QueryUtils;

        // --- Middleware (lifecycle hooks) ---
        const seatMapService = new SeatMapService();
        const middlewareService = new ShowingLifestyleService({seatMapService});
        middlewareService.registerHooks(ShowingSchema);

        // --- Services ---
        const crudService = new ShowingCRUDService({populateRefs});
        const queryService = new ShowingQueryService();
        const aggregateService = new AggregateQueryService({model, populateRefs});

        // --- Controller ---
        const controller = new ShowingController({
            crudService,
            repository,
            queryService,
            queryUtils,
            aggregateService,
        });

        return {
            model,
            repository,
            services: {
                crudService,
                queryService,
                aggregateService,
            },
            controllers: {
                controller,
            },
        };
    }
}
