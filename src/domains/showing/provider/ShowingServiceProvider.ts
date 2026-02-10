/**
 * @file ShowingServiceProvider.ts
 *
 * Dependency registration for the Showing domain.
 */

import Showing from "../model/showing/Showing.model.js";
import ShowingController from "../controller/ShowingController.js";
import QueryUtils from "../../../shared/services/query-utils/QueryUtils.js";
import AggregateQueryService from "../../../shared/services/aggregate/AggregateQueryService.js";
import SeatMapService from "../../seatmap/service/seat-map-service/SeatMapService.js";
import ShowingLifestyleService from "../service/lifestyle-service/ShowingLifestyleService.js";
import {ShowingSchema} from "../model/showing/Showing.schema.js";
import ShowingQueryOptionService from "../service/query-option/ShowingQueryOptionService.js";
import {BaseRepository} from "../../../shared/repository/BaseRepository.js";
import {ShowingCRUDWriter} from "../repositories/ShowingCRUDWriter.js";
import {ShowingPopulationPipelines} from "../queries/ShowingPopulationPipelines.js";
import {ShowingSeatMapVirtualPipelines} from "../queries/ShowingSeatMapVirtualPipelines.js";

/**
 * Service provider for the Showing module.
 *
 * Responsible for schema lifecycle registration and
 * dependency wiring for repositories, services, and controllers.
 */
export default class ShowingServiceProvider {
    /**
     * Registers schema lifecycle hooks.
     *
     * @remarks
     * Handles side effects such as seat-map creation
     * and cascading cleanup.
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
     * Registers all Showing infrastructure.
     */
    static register() {
        const model = Showing;
        const populateRefs = [
            {path: "movie", populate: {path: "genres"}},
            {path: "theatre"},
            {path: "screen"},
        ];

        const writer = new ShowingCRUDWriter({populateRefs});
        const repository = new BaseRepository({model, populateRefs, writer});

        const queryService = new ShowingQueryOptionService();
        const aggregateService = new AggregateQueryService({
            model,
            populationPipelines: ShowingPopulationPipelines,
            virtualsPipelines: ShowingSeatMapVirtualPipelines,
        });

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
