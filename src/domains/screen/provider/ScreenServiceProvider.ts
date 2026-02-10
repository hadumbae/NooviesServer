import Screen from "../model/Screen.model.js";

import {BaseRepository} from "../../../shared/repository/BaseRepository.js";
import ScreenController from "../controller/ScreenController.js";

import ScreenQueryOptionService from "../service/ScreenQueryOptionService.js";
import QueryUtils from "../../../shared/services/query-utils/QueryUtils.js";
import ScreenService from "../service/ScreenService.js";
import AggregateQueryService from "../../../shared/services/aggregate/AggregateQueryService.js";
import ScreenSeatService from "../service/screen-seat-service/ScreenSeatService.js";
import {ScreenSearchService} from "../service/screen-search-service/ScreenSearchService.js";
import {ScreenBrowseController} from "../controller/screen-browse/ScreenBrowseController.js";

/**
 * @file ScreenServiceProvider.ts
 *
 * Service provider responsible for wiring all Screen-related
 * models, repositories, services, and controllers.
 *
 * Acts as the composition root for the Screen module.
 */
export default class ScreenServiceProvider {
    /**
     * Registers and instantiates all Screen module dependencies.
     *
     * @returns Screen module bindings.
     *
     * @example
     * ```ts
     * const { services, controllers } = ScreenServiceProvider.register();
     * ```
     */
    static register() {
        const model = Screen;
        const populateRefs = ["theatre"];

        const repository = new BaseRepository({ model, populateRefs });
        const queryUtils = QueryUtils;

        const service = new ScreenService();
        const optionService = new ScreenQueryOptionService();
        const seatService = new ScreenSeatService();
        const searchService = new ScreenSearchService();
        const aggregateService = new AggregateQueryService({ model });

        const controller = new ScreenController({
            repository,
            queryUtils,
            service,
            seatService,
            optionService,
            aggregateService,
        });

        const browseController = new ScreenBrowseController({
            searchService,
            queryUtils,
        });

        return {
            /** Screen Mongoose model */
            model,

            /** Base CRUD repository */
            repository,

            /** Domain and query services */
            services: {
                service,
                seatService,
                optionService,
                aggregateService,
                searchService,
            },

            /** HTTP controllers */
            controllers: {
                controller,
                browseController,
            },
        };
    }
}
