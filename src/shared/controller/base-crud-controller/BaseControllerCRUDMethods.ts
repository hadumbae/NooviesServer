/**
 * @file BaseControllerCRUDMethods.ts
 * @summary
 * Contracts defining the standard CRUD and query capabilities
 * shared by all generic Mongoose-based controllers.
 *
 * @description
 * These interfaces formalize the API expected from CRUD controllers:
 * - Basic item operations (create, read, update, delete)
 * - Pagination utilities
 * - Aggregate query execution
 * - Query-option parsing (filters, sorts, limits)
 * - Population pipeline configuration
 *
 * The goal is to provide a consistent, type-safe structure that all controllers
 * can implement while still allowing specialized logic via generics.
 */

import type {Request, Response} from "express";
import type {PopulationPipelineStages} from "../../types/mongoose/AggregatePipelineStages.js";
import type {IBaseControllerConstructor} from "../BaseController.js";
import type BaseRepository from "../../repository/BaseRepository.js";
import type AggregateQueryService from "../../services/aggregate/AggregateQueryService.js";
import type {QueryOptionTypes} from "../../types/query-options/QueryOptionService.types.js";
import type {ModelObject} from "../../types/ModelObject.js";

/**
 * Standard CRUD and query methods available to all entity controllers.
 *
 * @template TSchema - Mongoose document schema with required `_id`.
 * @template TMatchFilters - Filter shape used in query-option parsing.
 */
export interface BaseControllerCRUDMethods<
    TSchema extends ModelObject,
    TMatchFilters = any,
> {
    /**
     * Fetch all items with optional population or limits.
     *
     * @param req - Express request.
     * @param res - Express response.
     * @returns A response containing all matching items.
     */
    all(req: Request, res: Response): Promise<Response>;

    /**
     * Fetch paginated items.
     *
     * Expects pagination parameters in the request (e.g., `page`, `limit`).
     *
     * @param req - Express request.
     * @param res - Express response.
     * @returns A response including items and pagination metadata.
     */
    paginated(req: Request, res: Response): Promise<Response>;

    /**
     * Create a new item using validated request body data.
     *
     * @param req - Express request with validated body.
     * @param res - Express response.
     * @returns A response containing the created item.
     */
    create(req: Request, res: Response): Promise<Response>;

    /**
     * Retrieve one item by its `_id`.
     *
     * @param req - Express request with an `_id` route param.
     * @param res - Express response.
     * @returns A response containing the found item, if any.
     */
    get(req: Request, res: Response): Promise<Response>;

    /**
     * Update an item by its `_id`.
     *
     * @param req - Express request containing the `_id` param and the update body.
     * @param res - Express response.
     * @returns A response containing the updated item.
     */
    update(req: Request, res: Response): Promise<Response>;

    /**
     * Delete an item by `_id`.
     *
     * @param req - Express request with `_id` param.
     * @param res - Express response.
     * @returns A response confirming deletion.
     */
    delete(req: Request, res: Response): Promise<Response>;

    /**
     * Execute a fully configurable aggregate query:
     * filters, sorting, pipelines, pagination, and lookup population.
     *
     * @param req - Express request containing query parameters.
     * @param res - Express response.
     * @returns A response with processed aggregation results.
     */
    query(req: Request, res: Response): Promise<Response>;

    /**
     * Parse filters, sorts, pagination, and other query options from the request.
     *
     * @param req - Express request.
     * @returns A structured and validated set of query options.
     */
    fetchQueryOptions(req: Request): QueryOptionTypes<TSchema, TMatchFilters>;

    /**
     * Provide Mongoose aggregation pipeline stages that populate related entities.
     *
     * Used by `query()` to assemble a full pipeline.
     *
     * @returns Population-related pipeline stages.
     */
    fetchPopulatePipelines(): PopulationPipelineStages;
}

/**
 * Constructor parameters for a CRUD controller subclass.
 *
 * Includes the required repository and aggregate query service.
 *
 * @template TSchema - Mongoose document schema handled by the controller.
 */
export interface IBaseCRUDControllerConstructor<TSchema extends ModelObject> extends IBaseControllerConstructor {
    /** Repository responsible for the entity’s CRUD operations. */
    repository: BaseRepository<TSchema>;

    /** Service providing configurable aggregate query execution. */
    aggregateService: AggregateQueryService<TSchema>;
}
