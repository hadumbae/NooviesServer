import type {Request, Response} from "express";
import type {PopulationPipelineStages} from "../../types/mongoose/AggregatePipelineStages.js";
import type {IBaseControllerConstructor} from "../BaseController.js";
import type BaseRepository from "../../repository/BaseRepository.js";
import type AggregateQueryService from "../../services/aggregate/AggregateQueryService.js";
import type {QueryOptionTypes} from "../../types/query-options/QueryOptionService.types.js";

/**
 * Contract for generic CRUD controllers.
 * Provides standard CRUD + query utilities for Mongoose entities.
 *
 * @template TSchema - Document schema type.
 * @template TMatchFilters - Type used for query filters.
 */
export interface BaseControllerCRUDMethods<
    TSchema = Record<string, any>,
    TMatchFilters = any,
> {
    /**
     * Fetch all items, optionally populated or limited.
     * @param req - Express request object.
     * @param res - Express response object.
     * @returns Express response containing all items.
     */
    all(req: Request, res: Response): Promise<Response>;

    /**
     * Fetch paginated items.
     * @param req - Express request object.
     * @param res - Express response object.
     * @returns Express response with pagination metadata and items.
     */
    paginated(req: Request, res: Response): Promise<Response>;

    /**
     * Create a new item.
     * @param req - Express request containing validated body.
     * @param res - Express response object.
     * @returns Express response with the created item.
     */
    create(req: Request, res: Response): Promise<Response>;

    /**
     * Get a single item by its `_id`.
     * @param req - Express request containing `_id` param.
     * @param res - Express response object.
     * @returns Express response with the found item.
     */
    get(req: Request<TSchema>, res: Response): Promise<Response>;

    /**
     * Update an item by its `_id`.
     * @param req - Express request containing `_id` param and update body.
     * @param res - Express response object.
     * @returns Express response with the updated item.
     */
    update(req: Request<TSchema>, res: Response): Promise<Response>;

    /**
     * Delete an item by `_id`.
     * @param req - Express request containing `_id` param.
     * @param res - Express response object.
     * @returns Express response indicating deletion success.
     */
    delete(req: Request, res: Response): Promise<Response>;

    /**
     * Execute an aggregate query with filters, sorts, pipelines, and pagination.
     * @param req - Express request containing query parameters.
     * @param res - Express response object.
     * @returns Express response with query results.
     */
    query(req: Request, res: Response): Promise<Response>;

    /**
     * Parse query options (filters, sorts, etc.) from the request.
     * @param req - Express request object.
     * @returns Parsed query option parameters.
     */
    fetchQueryOptions(req: Request): QueryOptionTypes<TSchema, TMatchFilters>;

    /**
     * Provide population pipelines for aggregate queries.
     * @returns Array of population pipeline stages.
     */
    fetchPopulatePipelines(): PopulationPipelineStages;
}

/**
 * Constructor parameters for {@link BaseCRUDController}.
 *
 * @template TSchema - Document schema type handled by the controller.
 */
export interface IBaseCRUDControllerConstructor<
    TSchema extends Record<string, any>
> extends IBaseControllerConstructor {
    /** Repository instance for CRUD operations. */
    repository: BaseRepository<TSchema>;

    /** Aggregate query service for pipeline-based queries. */
    aggregateService: AggregateQueryService<TSchema>;
}
