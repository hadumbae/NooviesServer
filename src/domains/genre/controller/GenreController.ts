import BaseCRUDController from "../../../shared/controller/base-crud-controller/BaseCRUDController.js";
import type IGenre from "../model/Genre.interface.js";
import type { Request } from "express";
import type GenreQueryOptionService from "../service/GenreQueryOptionService.js";
import type { FilterQuery, SortOrder } from "mongoose";
import type { GenreQueryFilters } from "../schema/options/GenreFilters.types.js";
import type {
    IBaseCRUDController,
    IBaseCRUDControllerConstructor
} from "../../../shared/controller/base-crud-controller/BaseCRUDController.types.js";

/**
 * Interface for the Genre controller, extending the base CRUD controller interface.
 */
export interface IGenreController extends IBaseCRUDController {}

/**
 * Constructor interface for {@link GenreController}.
 */
export interface IGenreControllerConstructor extends IBaseCRUDControllerConstructor<IGenre> {
    /** Service responsible for generating query filters and sorts from request parameters. */
    optionService: GenreQueryOptionService;
}

/**
 * Controller responsible for handling CRUD operations and query filtering
 * for {@link IGenre} documents.
 *
 * Extends the generic {@link BaseCRUDController} with genre-specific query
 * filtering and sorting logic using {@link GenreQueryOptionService}.
 */
export default class GenreController extends BaseCRUDController<IGenre> implements IGenreController {
    /** Service used to fetch query parameters and generate filters/sorts. */
    optionService: GenreQueryOptionService;

    /**
     * Creates a new instance of {@link GenreController}.
     *
     * @param optionService - Service to generate query filters and sorting options.
     * @param superParams - Additional parameters required by the base CRUD controller.
     */
    constructor({ optionService, ...superParams }: IGenreControllerConstructor) {
        super(superParams);
        this.optionService = optionService;
    }

    /**
     * Generates Mongoose match filters from the request URL parameters.
     *
     * @param req - Express request object.
     * @returns A {@link FilterQuery} object for Mongoose queries.
     */
    fetchURLMatchFilters(req: Request): FilterQuery<GenreQueryFilters> {
        const params = this.optionService.fetchQueryParams(req);
        return this.optionService.generateMatchFilters(params);
    }

    /**
     * Generates Mongoose sort instructions from the request URL parameters.
     *
     * @param req - Express request object.
     * @returns Partial mapping of {@link IGenre} fields to sort orders (`asc`/`desc`).
     */
    fetchURLQuerySorts(req: Request): Partial<Record<keyof IGenre, SortOrder>> {
        const params = this.optionService.fetchQueryParams(req);
        return this.optionService.generateQuerySorts(params);
    }
}
