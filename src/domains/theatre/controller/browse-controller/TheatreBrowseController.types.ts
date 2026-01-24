/**
 * @file TheatreBrowseController.types.ts
 *
 * Public types for `TheatreBrowseController`.
 */

import type {Request, Response} from "express";
import type {IBaseControllerConstructor} from "../../../../shared/controller/BaseController.js";
import type TheatreQueryOptionService from "../../services/query/TheatreQueryOptionService.js";
import type {TheatreSearchService} from "../../services/search-service/TheatreSearchService.js";

/**
 * Dependency container for `TheatreBrowseController`.
 */
export type TheatreBrowseControllerConstructor =
    IBaseControllerConstructor & {
    /** Parses and validates theatre-related query parameters */
    optionService: TheatreQueryOptionService;

    /** Executes theatre browsing and search queries */
    searchService: TheatreSearchService;
};

/**
 * Public API exposed by `TheatreBrowseController`.
 */
export interface TheatreBrowseMethods {
    /**
     * Responds with paginated theatres that currently have showings.
     */
    fetchPaginatedTheatresWithShowings(req: Request, res: Response): Promise<Response>;
}
