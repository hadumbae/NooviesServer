import SeatMap from "../model/SeatMap.model.js";
import SeatMapController from "../controller/SeatMapController.js";
import SeatMapService from "../service/seat-map-service/SeatMapService.js";
import QueryUtils from "../../../shared/services/query-utils/QueryUtils.js";
import SeatMapQueryOptionService from "../service/query-option/SeatMapQueryOptionService.js";
import AggregateQueryService from "../../../shared/services/aggregate/AggregateQueryService.js";
import SeatMapRepository from "../repositories/SeatMapRepository.js";
import SeatMapPopulateRefs from "../constants/SeatMapPopulateRefs.js";

/**
 * Service provider for SeatMap-related operations.
 *
 * Responsible for:
 * - Instantiating the SeatMap model repository.
 * - Providing the SeatMap controller.
 * - Providing services for business logic, query handling, and aggregation.
 *
 * @remarks
 * Centralizes registration of all SeatMap components. Can be used to extract controllers,
 * services, and repositories for route configuration or dependency injection.
 */
export default class SeatMapServiceProvider {
    /**
     * Registers all SeatMap-related components and returns them in a structured object.
     *
     * @returns An object containing:
     * - `model`: The SeatMap Mongoose model.
     * - `repository`: Base repository for CRUD operations with populated references.
     * - `services`: Collection of service instances:
     *   - `service`: Core SeatMap business logic.
     *   - `queryService`: Handles advanced query operations.
     *   - `aggregateService`: Handles aggregation pipelines.
     * - `controllers`: Collection of controllers:
     *   - `controller`: The main SeatMap controller.
     */
    static register() {
        const model = SeatMap;

        /**
         * References to populate on queries for the SeatMap resource.
         */
        const populateRefs = SeatMapPopulateRefs;

        const queryUtils = QueryUtils;
        const repository = new SeatMapRepository({populateRefs});

        const service = new SeatMapService();
        const queryService = new SeatMapQueryOptionService();
        const aggregateService = new AggregateQueryService({model, populateRefs});

        const controller = new SeatMapController({repository, service, queryService, queryUtils, aggregateService});

        return {
            model,
            repository,
            services: {
                service,
                queryService,
                aggregateService,
            },
            controllers: {
                controller
            },
        };
    }
}
