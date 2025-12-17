/**
 * @file ShowingServiceProvider.ts
 * @summary Centralized service provider for the Showing module.
 *
 * @description
 * Wires together all Showing-related components, including:
 * - The Mongoose `Showing` model.
 * - Repository and data-access utilities.
 * - CRUD, query, and aggregation services.
 * - Lifecycle middleware (e.g. seat-map creation and cleanup).
 * - The HTTP controller exposing Showing endpoints.
 *
 * This provider functions as a lightweight dependency container,
 * ensuring all Showing components are constructed and registered
 * in a consistent, predictable order.
 */

import Showing from "../model/Showing.model.js";
import BaseRepository from "../../../shared/repository/BaseRepository.js";
import ShowingController from "../controller/ShowingController.js";
import QueryUtils from "../../../shared/services/query-utils/QueryUtils.js";
import AggregateQueryService from "../../../shared/services/aggregate/AggregateQueryService.js";
import ShowingCRUDService from "../service/ShowingCRUDService.js";
import SeatMapService from "../../seatmap/service/seat-map-service/SeatMapService.js";
import ShowingLifestyleService from "../service/lifestyle-service/ShowingLifestyleService.js";
import {ShowingSchema} from "../model/Showing.schema.js";
import ShowingQueryOptionService from "../service/query-option/ShowingQueryOptionService.js";

/**
 * @summary Service provider for the Showing module.
 *
 * @remarks
 * This class centralizes construction and registration of all components
 * that depend on the `Showing` model. It exists purely as a bootstrapper
 * and contains no business logic of its own.
 *
 * Responsibilities:
 * - Register Showing lifecycle middleware.
 * - Construct repositories and services.
 * - Wire dependencies into the HTTP controller.
 */
export default class ShowingServiceProvider {
    /**
     * Registers Showing lifecycle middleware and schema hooks.
     *
     * @remarks
     * This method attaches all lifecycle hooks to `ShowingSchema`,
     * including seat-map creation on insert and cascading cleanup
     * on deletion.
     *
     * It is intentionally separated from {@link register} so that
     * middleware can be initialized during model import.
     *
     * @returns Registered middleware dependencies.
     */
    static registerMiddleware() {
        // --- Lifecycle Middleware ---
        const seatMapService = new SeatMapService();
        const middlewareService = new ShowingLifestyleService({seatMapService});

        middlewareService.registerHooks(ShowingSchema);

        return {
            seatMapService,
            middlewareService,
        };
    }

    /**
     * Initializes and wires all Showing-related components.
     *
     * @returns An object containing:
     * - **model** — The Mongoose `Showing` model.
     * - **repository** — Configured `BaseRepository` instance.
     * - **services**
     *   - `crudService` — Create and update operations.
     *   - `queryService` — Filtering and list utilities.
     *   - `aggregateService` — Aggregation and analytics pipelines.
     * - **controllers**
     *   - `controller` — HTTP controller exposing Showing endpoints.
     *
     * @example
     * ```ts
     * const { controllers } = ShowingServiceProvider.register();
     * app.use("/api/showings", controllers.controller.router);
     * ```
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

        // --- Query Utilities ---
        const queryUtils = QueryUtils;

        // --- Services ---
        const crudService = new ShowingCRUDService({populateRefs});
        const queryService = new ShowingQueryOptionService();
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
