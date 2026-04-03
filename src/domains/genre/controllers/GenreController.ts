import BaseCRUDController from "../../../shared/controller/base-crud-controller/BaseCRUDController.js";
import type {Request} from "express";
import type {
    BaseControllerCRUDMethods,
    BaseCRUDControllerConstructorParams
} from "@shared/controller/base-crud-controller/BaseControllerCRUDMethods";
import type {QueryOptionTypes} from "@shared/types/query-options/QueryOptionService.types";
import type {GenreSchemaFields} from "../models/genre/Genre.types.js";
import type {GenreQueryMatchFilters} from "@domains/genre/validation/query/GenreQueryMatchFiltersSchema";
import {GenreQueryOptionsSchema} from "@domains/genre/validation/query/GenreQueryOptionsSchema";
import {parseModelQueryOptions} from "@shared/utility/request/parseModelQueryOptions";

/**
 * Interface for the Genre controller, extending the base CRUD controller interface.
 */
export interface IGenreController extends BaseControllerCRUDMethods<GenreSchemaFields, GenreQueryMatchFilters> {
}

/**
 * Constructor interface for {@link GenreController}.
 */
export interface IGenreControllerConstructor extends BaseCRUDControllerConstructorParams<GenreSchemaFields> {
}

/**
 * Controller responsible for handling CRUD operations and query filtering
 * for {@link GenreSchemaFields} documents.
 *
 * Extends the generic {@link BaseCRUDController} with genre-specific query
 * filtering and sorting logic using {@link GenreQueryOptionService}.
 */
export default class GenreController extends BaseCRUDController<GenreSchemaFields> implements IGenreController {
    /**
     * Creates a new instance of {@link GenreController}.
     *
     * @param optionService - Service to generate query filters and sorting options.
     * @param superParams - Additional parameters required by the base CRUD controller.
     */
    constructor(superParams: IGenreControllerConstructor) {
        super(superParams);
    }

    /**
     * Fetches and generates complete query options (filters and sorting)
     * for genre documents based on the request parameters.
     *
     * @param req - Express request object containing query parameters.
     * @returns Query options suitable for Mongoose queries, including filters and sorts.
     */
    fetchQueryOptions(req: Request): QueryOptionTypes<GenreSchemaFields, GenreQueryMatchFilters> {
        const queryOptions = parseModelQueryOptions({
            req,
            schema: GenreQueryOptionsSchema,
            modelName: "Genres",
        });

        return {
            match: queryOptions
        };
    }
}
