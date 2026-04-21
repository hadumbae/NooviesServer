import {Screen} from "@domains/screen/models/screen";
import QueryUtils from "../../../shared/services/query-utils/QueryUtils.js";
import {ScreenSearchService} from "../_feat/view-data-client/ScreenSearchService";
import {ScreenBrowseController} from "../_feat/view-data-client/ScreenBrowseController";

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
        const queryUtils = QueryUtils;
        const searchService = new ScreenSearchService();
        const browseController = new ScreenBrowseController({
            searchService,
            queryUtils,
        });

        return {
            model,
            controllers: {browseController},
        };
    }
}
