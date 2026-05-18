/**
 * @fileoverview Dependency registration and infrastructure wiring for the Showing domain.
 */

import Showing from "../models/showing/Showing.model.js";
import ShowingController from "../controllers/ShowingController.js";
import QueryUtils from "../../../shared/services/query-utils/QueryUtils.js";
import AggregateQueryService from "../../../shared/services/aggregate/AggregateQueryService.js";
import ShowingQueryOptionService from "../services/query-option/ShowingQueryOptionService.js";
import {BaseRepository} from "@shared/repository/BaseRepository";
import {ShowingCRUDWriter} from "../repositories/ShowingCRUDWriter.js";
import {ShowingPopulationPipelines} from "../queries/ShowingPopulationPipelines.js";
import {ShowingSeatMapVirtualPipelines} from "../queries/ShowingSeatMapVirtualPipelines.js";

/** Service provider responsible for wiring repositories, services, and controllers for the Showing module. */
export default class ShowingServiceProvider {
    /** Initializes and returns the full dependency graph for the Showing domain. */
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
