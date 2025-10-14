import Showing from "../model/Showing.model.js";
import BaseRepository from "../../../shared/repository/BaseRepository.js";
import ShowingController from "../controller/ShowingController.js";
import QueryUtils from "../../../shared/utility/query/QueryUtils.js";
import ShowingQueryService from "../service/ShowingQueryService.js";
import AggregateQueryService from "../../../shared/services/aggregate/AggregateQueryService.js";

/**
 * Service provider for Showing-related operations.
 *
 * Responsible for:
 * - Instantiating the Showing model repository.
 * - Providing the Showing controller.
 * - Providing services for query handling, and aggregation.
 *
 * @remarks
 * This class centralizes the registration of all services, controllers, and repository
 * objects for the `Showing` resource. It can be used to extract controllers and services
 * for route configuration or dependency injection.
 */
export default class ShowingServiceProvider {
    /**
     * Registers all Showing-related components and returns them in a structured object.
     *
     * @returns An object containing:
     * - `model`: The Showing Mongoose model.
     * - `repository`: Base repository for CRUD operations with populated references.
     * - `services`: Collection of service instances:
     *   - `queryService`: Handles complex queries for Showings.
     *   - `aggregateService`: Handles aggregation pipelines.
     * - `controllers`: Collection of controllers:
     *   - `controller`: The main Showing controller.
     */
    static register() {
        const model = Showing;

        /**
         * References to populate on queries for the Showing resource.
         */
        const populateRefs= [
            {path: "movie"},
            {path: "theatre"},
            {path: "screen"},
            {path: "seating", populate: {path: "seat"}},
        ];

        const repository = new BaseRepository({model, populateRefs});
        const queryUtils = QueryUtils;

        const queryService = new ShowingQueryService();
        const aggregateService = new AggregateQueryService({model, populateRefs});

        const controller = new ShowingController({
            repository,
            queryService,
            queryUtils,
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
            }
        };
    }
}
