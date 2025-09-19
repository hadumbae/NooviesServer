import BaseCRUDController from "../../../shared/controller/base-crud-controller/BaseCRUDController.js";
import type ITheatre from "../model/ITheatre.js";
import type TheatreQueryOptionService from "../services/query/TheatreQueryOptionService.js";
import type {FilterQuery, SortOrder} from "mongoose";
import type {Request} from "express";
import type {TheatreQueryFilters} from "../schema/query/TheatreQueryOptions.types.js";
import type {
    IBaseCRUDController,
    IBaseCRUDControllerConstructor
} from "../../../shared/controller/base-crud-controller/BaseCRUDController.types.js";

/**
 * Interface representing the public contract for {@link TheatreController}.
 *
 * Extends {@link IBaseCRUDController} and can be extended to add theatre-specific endpoints.
 */
export interface ITheatreController extends IBaseCRUDController {
}

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
 */
export default class TheatreController extends BaseCRUDController<ITheatre> implements ITheatreController {
    /** Service for handling query options, filters, and sorts for theatres. */
    protected optionService: TheatreQueryOptionService;

    /**
     * Creates a new {@link TheatreController}.
     *
     * @param params - Constructor parameters including the base CRUD options
     *   and the {@link TheatreQueryOptionService}.
     */
    constructor(params: ITheatreControllerConstructor) {
        const {optionService, ...superParams} = params;
        super(superParams);

        this.optionService = optionService;
    }

    /**
     * Builds MongoDB `$match` filters from the request query parameters.
     *
     * @param req - Express request containing query parameters
     * @returns A Mongoose {@link FilterQuery} for {@link ITheatre}
     *
     * @example
     * // ?city=Bangkok&seatCapacity=200
     * // returns: { "location.city": { $regex: "Bangkok", $options: "i" }, seatCapacity: 200 }
     */
    fetchURLMatchFilters(req: Request): FilterQuery<TheatreQueryFilters> {
        const queries = this.optionService.fetchQueryParams(req);
        return this.optionService.generateMatchFilters(queries);
    }

    /**
     * Generates Mongoose sort specifications from the request query parameters.
     *
     * @param req - Express request containing query parameters
     * @returns Partial record mapping {@link ITheatre} fields to {@link SortOrder}
     *
     * @example
     * // ?sort[seatCapacity]=desc&sort[city]=asc
     * // returns: { seatCapacity: -1, "location.city": 1 }
     */
    fetchURLQuerySorts(req: Request): Partial<Record<keyof ITheatre, SortOrder>> {
        const params = this.optionService.fetchQueryParams(req);
        return this.optionService.generateQuerySorts(params);
    }
}
