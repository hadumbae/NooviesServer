import BaseCRUDController from "../../../shared/controller/base-crud-controller/BaseCRUDController.js";
import type ITheatre from "../model/ITheatre.js";
import type TheatreQueryOptionService from "../services/query/TheatreQueryOptionService.js";
import type { Request } from "express";
import type { TheatreQueryMatchFilters } from "../schema/query/TheatreQueryOption.types.js";
import type {
    IBaseCRUDController,
    IBaseCRUDControllerConstructor
} from "../../../shared/controller/base-crud-controller/BaseCRUDController.types.js";
import type { QueryOptionTypes } from "../../../shared/types/query-options/QueryOptionService.types.js";

/**
 * Interface representing the public contract for {@link TheatreController}.
 *
 * Extends {@link IBaseCRUDController} and can be extended to add theatre-specific endpoints.
 */
export interface ITheatreController extends IBaseCRUDController {}

/**
 * Constructor parameters for {@link TheatreController}.
 *
 * Extends {@link IBaseCRUDControllerConstructor} with an additional
 * {@link TheatreQueryOptionService} for handling query filters and sorting.
 */
export interface ITheatreControllerConstructor extends IBaseCRUDControllerConstructor<ITheatre> {
    /** Service for parsing, validating, and generating query filters and sorts. */
    optionService: TheatreQueryOptionService;
}

/**
 * Controller responsible for handling CRUD operations for {@link ITheatre}.
 *
 * Extends {@link BaseCRUDController} and adds the ability to:
 * - Parse query parameters from Express requests
 * - Generate Mongoose-compatible `$match` filters
 * - Generate Mongoose-compatible sort specifications
 *
 * @example
 * // GET /theatres?name=Grand&sortByName=1
 * // Controller will:
 * // - Match theatres with name "Grand"
 * // - Sort results by name ascending
 */
export default class TheatreController extends BaseCRUDController<ITheatre> implements ITheatreController {
    /** Service for handling query options, filters, and sorts for theatres. */
    protected optionService: TheatreQueryOptionService;

    /**
     * Creates a new {@link TheatreController}.
     *
     * @param params - Constructor parameters including the base CRUD options
     *   and the {@link TheatreQueryOptionService}.
     *
     * @example
     * const controller = new TheatreController({
     *   repository: theatreRepository,
     *   optionService: theatreQueryOptionService
     * });
     */
    constructor(params: ITheatreControllerConstructor) {
        const { optionService, ...superParams } = params;
        super(superParams);

        this.optionService = optionService;
    }

    /**
     * Fetches query options (filters and sorts) for Theatre documents
     * based on the request parameters.
     *
     * @param req - Express request containing query parameters
     * @returns Query options suitable for Mongoose queries
     *
     * @example
     * // GET /theatres?name=Grand&sortByName=1
     * // Returns:
     * // {
     * //   match: {
     * //     filters: { name: /Grand/i },
     * //     sorts: { name: 1 }
     * //   }
     * // }
     */
    fetchQueryOptions(req: Request): QueryOptionTypes<ITheatre, TheatreQueryMatchFilters> {
        const params = this.optionService.fetchQueryParams(req);
        return this.optionService.generateQueryOptions(params);
    }
}
