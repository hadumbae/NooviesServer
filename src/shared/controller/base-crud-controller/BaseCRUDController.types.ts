import type {Request, Response} from "express";
import type {
    PopulationPipelineStages,
} from "../../types/mongoose/AggregatePipelineStages.js";
import type {IBaseControllerConstructor} from "../BaseController.js";
import type BaseRepository from "../../repository/BaseRepository.js";
import type AggregateQueryService from "../../services/aggregate/AggregateQueryService.js";
import type {QueryOptionTypes} from "../../types/query-options/QueryOptionService.types.js";

/**
 * Interface defining the contract for a generic CRUD controller.
 *
 * Provides methods for creating, reading, updating, deleting, and querying
 * Mongoose-based entities, as well as utilities for query option handling.
 *
 * @typeParam TSchema - The schema type handled by the controller.
 * @typeParam TMatchFilters - The filter type used in query matching.
 */
export interface IBaseCRUDController<
    TSchema = Record<string, any>,
    TMatchFilters = any,
> {
    /**
     * Retrieves all items with optional population, virtuals, or limit settings.
     *
     * @param req - Express request object.
     * @param res - Express response object.
     * @returns Promise resolving to an Express response containing the items.
     */
    all(req: Request, res: Response): Promise<Response>;

    /**
     * Retrieves a paginated list of items.
     *
     * @param req - Express request object.
     * @param res - Express response object.
     * @returns Promise resolving to an Express response with pagination metadata and items.
     */
    paginated(req: Request, res: Response): Promise<Response>;

    /**
     * Creates a new item in the collection.
     *
     * @param req - Express request object containing a validated body.
     * @param res - Express response object.
     * @returns Promise resolving to an Express response with the created item.
     */
    create(req: Request, res: Response): Promise<Response>;

    /**
     * Retrieves a single item by its MongoDB ObjectId.
     *
     * @param req - Express request object containing the `_id` parameter.
     * @param res - Express response object.
     * @returns Promise resolving to an Express response with the found item.
     */
    get(req: Request<TSchema>, res: Response): Promise<Response>;

    /**
     * Updates an existing item by its MongoDB ObjectId.
     *
     * @param req - Express request object containing validated update body and `_id` parameter.
     * @param res - Express response object.
     * @returns Promise resolving to an Express response with the updated item.
     */
    update(req: Request<TSchema>, res: Response): Promise<Response>;

    /**
     * Deletes an item by its MongoDB ObjectId.
     *
     * @param req - Express request object containing the `_id` parameter.
     * @param res - Express response object.
     * @returns Promise resolving to an Express response indicating deletion success.
     */
    delete(req: Request, res: Response): Promise<Response>;

    /**
     * Executes an aggregate query with support for filters, sorts, population pipelines,
     * and pagination.
     *
     * @param req - Express request object with query parameters.
     * @param res - Express response object.
     * @returns Promise resolving to an Express response with query results.
     */
    query(req: Request, res: Response): Promise<Response>;

    /**
     * Extracts query options (filters, sorts, etc.) from the request.
     *
     * @param req - Express request object.
     * @returns Parsed query option parameters.
     */
    fetchQueryOptions(req: Request): QueryOptionTypes<TSchema, TMatchFilters>;

    /**
     * Returns the population pipelines to apply in aggregate queries.
     *
     * @returns An array of population pipeline stages.
     */
    fetchPopulatePipelines(): PopulationPipelineStages;
}

/**
 * Constructor parameters for a {@link BaseCRUDController}.
 *
 * @typeParam TSchema - The schema type handled by the controller.
 */
export interface IBaseCRUDControllerConstructor<
    TSchema extends Record<string, any>
> extends IBaseControllerConstructor {
    /** Repository instance used for direct CRUD operations. */
    repository: BaseRepository<TSchema>;

    /** Aggregate query service for handling advanced queries with pipelines. */
    aggregateService: AggregateQueryService<TSchema>;
}
