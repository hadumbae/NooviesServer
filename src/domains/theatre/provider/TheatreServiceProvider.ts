/**
 * @file TheatreServiceProvider.ts
 *
 * Service provider for the Theatre domain.
 *
 * Centralizes construction and wiring of all Theatre-related
 * models, repositories, services, and controllers.
 *
 * Intended to be consumed by routing layers or higher-level
 * application modules.
 *
 * @example
 * ```ts
 * const {
 *   controllers: { controller },
 * } = TheatreServiceProvider.register();
 *
 * app.use("/theatres", createBaseRoutes({ crudController: controller }));
 * ```
 */

import {BaseRepository} from "../../../shared/repository/BaseRepository.js";
import TheatreController from "../controller/TheatreController.js";
import QueryUtils from "../../../shared/services/query-utils/QueryUtils.js";
import AggregateQueryService from "../../../shared/services/aggregate/AggregateQueryService.js";
import type {PopulatePath} from "../../../shared/types/mongoose/PopulatePath.js";
import TheatreQueryOptionService from "../services/query/TheatreQueryOptionService.js";
import Theatre from "../model/Theatre.model.js";
import {TheatreSearchService} from "../services/search-service/TheatreSearchService.js";
import {TheatreBrowseController} from "../controller/browse-controller/TheatreBrowseController.js";

export default class TheatreServiceProvider {

    /**
     * Registers and wires all Theatre domain dependencies.
     *
     * @returns Fully initialized Theatre domain components
     */
    static register() {
        /** Theatre Mongoose model */
        const model = Theatre;

        /** Population paths for Theatre relations */
        const populateRefs: PopulatePath[] = [];

        /** Generic CRUD repository for Theatre */
        const repository = new BaseRepository({model, populateRefs});

        /** Shared query parsing utilities */
        const queryUtils = QueryUtils;

        /** Aggregation helper bound to the Theatre model */
        const aggregateService = new AggregateQueryService({model});

        /** Theatre-specific query option parser */
        const optionService = new TheatreQueryOptionService();

        /** Aggregation-driven search service for browse endpoints */
        const searchService = new TheatreSearchService();

        /** Admin CRUD controller */
        const controller = new TheatreController({
            repository,
            queryUtils,
            aggregateService,
            optionService,
        });

        /** Public browse controller */
        const browseController = new TheatreBrowseController({
            searchService,
        });

        return {
            model,
            repository,
            services: {
                optionService,
                aggregateService,
                searchService,
            },
            controllers: {
                controller,
                browseController,
            },
        };
    }
}
