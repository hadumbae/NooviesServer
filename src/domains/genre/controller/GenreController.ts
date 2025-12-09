import BaseCRUDController from "../../../shared/controller/base-crud-controller/BaseCRUDController.js";
import type IGenre from "../model/Genre.interface.js";
import type { Request } from "express";
import type GenreQueryOptionService from "../service/GenreQueryOptionService.js";
import type { GenreQueryMatchFilters } from "../schema/query/GenreQueryOption.types.js";
import type {
    BaseControllerCRUDMethods,
    IBaseCRUDControllerConstructor
} from "../../../shared/controller/base-crud-controller/BaseControllerCRUDMethods.js";
import type { QueryOptionTypes } from "../../../shared/types/query-options/QueryOptionService.types.js";

/**
 * Interface for the Genre controller, extending the base CRUD controller interface.
 */
export interface IGenreController extends BaseControllerCRUDMethods {}

/**
 * Constructor interface for {@link GenreController}.
 */
export interface IGenreControllerConstructor extends IBaseCRUDControllerConstructor<IGenre> {
    /**
     * Service responsible for generating query filters and sorts from request parameters.
     */
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
     * Fetches and generates complete query options (filters and sorting)
     * for genre documents based on the request parameters.
     *
     * @param req - Express request object containing query parameters.
     * @returns Query options suitable for Mongoose queries, including filters and sorts.
     */
    fetchQueryOptions(req: Request): QueryOptionTypes<IGenre, GenreQueryMatchFilters> {
        const params = this.optionService.fetchQueryParams(req);
        return this.optionService.generateQueryOptions(params);
    }
}
