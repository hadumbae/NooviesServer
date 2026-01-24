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
import type TheatreQueryOptionService from "../../services/query/TheatreQueryOptionService.js";
import type {
    TheatreBrowseControllerConstructor,
    TheatreBrowseMethods,
} from "./TheatreBrowseController.types.js";

/**
 * Controller responsible for browsing theatres with scheduled showings.
 */
export class TheatreBrowseController
    extends BaseController
    implements TheatreBrowseMethods
{
    protected optionService: TheatreQueryOptionService;
    protected searchService: TheatreSearchService;

    constructor(params: TheatreBrowseControllerConstructor) {
        const {searchService, optionService, queryUtils} = params;

        super({queryUtils});
        this.searchService = searchService;
        this.optionService = optionService;
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
        const {city, state, country, postalCode} =
            this.optionService.fetchQueryParams(req);

        const data =
            await this.searchService.fetchPaginatedTheatresWithShowings({
                page,
                perPage,
                limit,
                identifiers: {
                    city,
                    state,
                    country,
                    postalCode,
                },
            });

        return res.status(200).json(data);
    }
}
