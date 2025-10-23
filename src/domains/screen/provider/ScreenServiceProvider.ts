import Screen from "../model/Screen.js";

import BaseRepository from "../../../shared/repository/BaseRepository.js";
import ScreenController from "../controller/ScreenController.js";

import ScreenQueryOptionService from "../service/ScreenQueryOptionService.js";
import QueryUtils from "../../../shared/services/query-utils/QueryUtils.js";
import ScreenService from "../service/ScreenService.js";
import AggregateQueryService from "../../../shared/services/aggregate/AggregateQueryService.js";
import ScreenSeatService from "../service/screen-seat-service/ScreenSeatService.js";

/**
 * Service provider for the Screen module.
 *
 * Responsible for instantiating and registering all components related to screens,
 * including:
 * - Mongoose model
 * - Repository
 * - Services for business logic, query handling, seat management, and aggregation
 * - Controller for handling HTTP requests
 *
 * @example
 * ```ts
 * const { model, repository, services, controllers } = ScreenServiceProvider.register();
 * const { controller } = controllers;
 * ```
 */
export default class ScreenServiceProvider {
    /**
     * Registers and returns all Screen-related components.
     *
     * @returns An object containing:
     * - `model`: The Screen Mongoose model
     * - `repository`: Base repository for CRUD operations
     * - `services`: Collection of instantiated services:
     *    - `service`: Core ScreenService
     *    - `seatService`: Service for screen seat operations
     *    - `optionService`: Service for parsing and validating query parameters
     *    - `aggregateService`: Service for aggregation queries
     * - `controllers`: Collection of instantiated controllers:
     *    - `controller`: ScreenController instance
     */
    static register() {
        const model = Screen;
        const populateRefs = ["theatre"];

        const repository = new BaseRepository({ model, populateRefs });
        const queryUtils = QueryUtils;

        const service = new ScreenService();
        const optionService = new ScreenQueryOptionService();
        const seatService = new ScreenSeatService();
        const aggregateService = new AggregateQueryService({ model, populateRefs });

        const controller = new ScreenController({
            repository,
            queryUtils,
            service,
            seatService,
            optionService,
            aggregateService,
        });

        return {
            model,
            repository,
            services: {
                service,
                seatService,
                optionService,
                aggregateService,
            },
            controllers: {
                controller,
            },
        };
    }
}
