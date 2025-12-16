import BaseRepository from "../../../shared/repository/BaseRepository.js";
import TheatreController from "../controller/TheatreController.js";
import QueryUtils from "../../../shared/services/query-utils/QueryUtils.js";
import AggregateQueryService from "../../../shared/services/aggregate/AggregateQueryService.js";
import type {PopulatePath} from "../../../shared/types/mongoose/PopulatePath.js";
import TheatreQueryOptionService from "../services/query/TheatreQueryOptionService.js";
import Theatre from "../model/Theatre.model.js";

/**
 * Service provider for the `Theatre` domain.
 *
 * @description
 * Centralizes the initialization and wiring of all Theatre-related
 * components (model, repository, services, and controller).
 *
 * Consumers can call {@link TheatreServiceProvider.register} to receive
 * a fully configured set of instances ready to be used in routes,
 * dependency injection, or higher-level application logic.
 *
 * @example
 * ```ts
 * const { model, controllers: { controller } } = TheatreServiceProvider.register();
 * app.use("/theatres", createBaseRoutes({ crudController: controller }));
 * ```
 */
export default class TheatreServiceProvider {
    /**
     * Registers and wires together all Theatre-related services, repository,
     * utilities, and controller.
     *
     * @returns An object containing:
     * - **model**: The raw Theatre Mongoose model.
     * - **repository**: A {@link BaseRepository} instance for Theatre.
     * - **services**:
     *   - {@link TheatreQueryOptionService} for handling query options.
     *   - {@link AggregateQueryService} for handling aggregation pipelines.
     * - **controllers**:
     *   - `controller`: The {@link TheatreController}, which orchestrates
     *     requests between repository, services, and utilities.
     */
    static register() {
        /** The underlying Theatre model. */
        const model = Theatre;

        /** Mongoose population paths for related documents. */
        const populateRefs: PopulatePath[] = [];

        /** Generic repository layer for Theatre CRUD operations. */
        const repository = new BaseRepository({model, populateRefs});

        /** Shared query utilities (filters, pagination, etc.). */
        const queryUtils = QueryUtils;

        /** Aggregation utilities bound to the Theatre model. */
        const aggregateService = new AggregateQueryService({model, populateRefs});

        /** Handles Theatre-specific query options (filters, projections, etc.). */
        const optionService = new TheatreQueryOptionService();

        /** Theatre controller exposing request handlers for routing. */
        const controller = new TheatreController({
            repository,
            queryUtils,
            aggregateService,
            optionService,
        });

        return {
            model,
            repository,
            services: {
                optionService,
                aggregateService,
            },
            controllers: {
                controller,
            },
        };
    }
}
