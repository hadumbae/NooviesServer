import Showing from "../model/Showing.model.js";
import BaseRepository from "../../../shared/repository/BaseRepository.js";
import ShowingController from "../controller/ShowingController.js";
import QueryUtils from "../../../shared/services/query-utils/QueryUtils.js";
import ShowingQueryService from "../service/ShowingQueryService.js";
import AggregateQueryService from "../../../shared/services/aggregate/AggregateQueryService.js";
import ShowingCRUDService from "../service/ShowingCRUDService.js";

/**
 * Service provider responsible for configuring all Showing-related components.
 *
 * @remarks
 * The `ShowingServiceProvider` centralizes initialization of:
 * - The Mongoose model for showings.
 * - Repository layer for CRUD operations.
 * - Query and aggregation services.
 * - The primary controller for HTTP routing.
 *
 * This provider simplifies dependency injection and route registration
 * by bundling all components into a single static `register()` method.
 *
 * @example
 * ```ts
 * import ShowingServiceProvider from "@/pages/showings/provider/ShowingServiceProvider.js";
 *
 * const { controllers } = ShowingServiceProvider.register();
 * app.use("/api/showings", controllers.controller.router);
 * ```
 */
export default class ShowingServiceProvider {
    /**
     * Registers and initializes all Showing-related dependencies.
     *
     * @returns An object containing initialized components:
     *
     * ### Model
     * - `model`: The Mongoose model for showings.
     *
     * ### Repository
     * - `repository`: Instance of {@link BaseRepository} configured with the Showing model.
     *
     * ### Services
     * - `crudService`: Handles creation and update logic with validation and timezone handling.
     * - `queryService`: Provides data retrieval and filtering utilities for showings.
     * - `aggregateService`: Supports aggregation pipelines for analytics or reporting.
     *
     * ### Controllers
     * - `controller`: Instance of {@link ShowingController} that exposes CRUD and query endpoints.
     */
    static register() {
        /** The Mongoose model for the Showing entity. */
        const model = Showing;

        /** Population paths for common Showing-related queries. */
        const populateRefs = [
            {path: "movie", populate: {path: "genres"}},
            {path: "theatre"},
            {path: "screen"},
        ];

        /** Generic repository for standard CRUD operations. */
        const repository = new BaseRepository({model, populateRefs});

        /** Shared query utility helpers used by controllers and services. */
        const queryUtils = QueryUtils;

        /** Service handling create and update logic for showings. */
        const crudService = new ShowingCRUDService({populateRefs});

        /** Service for building and executing complex queries on the Showing model. */
        const queryService = new ShowingQueryService();

        /** Service for building aggregation pipelines for analytical data retrieval. */
        const aggregateService = new AggregateQueryService({model, populateRefs});

        /** Controller managing HTTP routes for the Showing resource. */
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
