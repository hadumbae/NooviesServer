/**
 * @file TheatreBrowseController.ts
 *
 * HTTP controller for public theatre browsing endpoints.
 *
 * Responsibilities:
 * - Extract pagination and option data from the request
 * - Delegate query parsing to `TheatreQueryOptionService`
 * - Delegate data fetching to `TheatreSearchService`
 */

import BaseController from "../../../../shared/controller/BaseController.js";
import type {TheatreSearchService} from "../../services/search-service/TheatreSearchService.js";
import type {Request, Response} from "express";
import type {
    TheatreBrowseControllerConstructor,
    TheatreBrowseMethods,
} from "./TheatreBrowseController.types.js";
import {getLocationQueryOptions} from "../../../../shared/utility/features/query-options/getLocationQueryOptions.js";

/**
 * Controller responsible for browsing theatres with scheduled showings.
 */
export class TheatreBrowseController
    extends BaseController
    implements TheatreBrowseMethods {
    protected searchService: TheatreSearchService;

    constructor(params: TheatreBrowseControllerConstructor) {
        const {searchService, queryUtils} = params;

        super({queryUtils});
        this.searchService = searchService;
    }

    /**
     * Returns a paginated list of theatres that have active showings.
     *
     * Query support:
     * - Pagination (`page`, `perPage`)
     * - Optional result limit
     * - Location filters (city, state, country, postal code)
     *
     * @param req Express request
     * @param res Express response
     * @returns JSON payload containing paginated theatre results
     */
    async fetchPaginatedTheatresWithShowings(
        req: Request,
        res: Response,
    ): Promise<Response> {
        const {limit} = this.queryUtils.fetchOptionsFromQuery(req);
        const {page, perPage} = this.queryUtils.fetchPaginationFromQuery(req);
        const {target} = getLocationQueryOptions(req);

        const data =
            await this.searchService.fetchPaginatedTheatresByLocation({
                target,
                page,
                perPage,
                limit,
            });

        return res.status(200).json(data);
    }
}
