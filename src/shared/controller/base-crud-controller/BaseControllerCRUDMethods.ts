/**
 * @file BaseControllerCRUDMethods.ts
 *
 * Standard CRUD and query contracts for Mongoose-backed controllers.
 *
 * Defines the required controller surface for:
 * - CRUD operations
 * - Pagination
 * - Aggregate queries
 * - Query-option parsing
 * - Population pipeline configuration
 */

import type {Request, Response} from "express";
import type {PopulationPipelineStages} from "../../types/mongoose/AggregatePipelineStages.js";
import type {IBaseControllerConstructor} from "../BaseController.js";
import type BaseRepository from "../../repository/BaseRepository.js";
import type AggregateQueryService from "../../services/aggregate/AggregateQueryService.js";
import type {QueryOptionTypes} from "../../types/query-options/QueryOptionService.types.js";
import type {ModelObject} from "../../types/ModelObject.js";
import {Types} from "mongoose";

/**
 * CRUD and query methods required by all entity controllers.
 *
 * @template TSchema - Document shape handled by the controller.
 * @template TMatchFilters - Filter shape used during query parsing.
 */
export interface BaseControllerCRUDMethods<
    TSchema extends ModelObject = {_id: Types.ObjectId},
    TMatchFilters = unknown,
> {
    /**
     * Retrieve all items.
     *
     * @param req - Express request.
     * @param res - Express response.
     */
    all(req: Request, res: Response): Promise<Response>;

    /**
     * Retrieve paginated items.
     *
     * @param req - Express request.
     * @param res - Express response.
     */
    paginated(req: Request, res: Response): Promise<Response>;

    /**
     * Create a new item.
     *
     * @param req - Express request with validated body.
     * @param res - Express response.
     */
    create(req: Request, res: Response): Promise<Response>;

    /**
     * Retrieve a single item by ObjectId.
     *
     * @param req - Express request with `_id` route param.
     * @param res - Express response.
     */
    get(req: Request, res: Response): Promise<Response>;

    /**
     * Retrieve a single item by slug.
     *
     * @param req - Express request with `slug` route param.
     * @param res - Express response.
     */
    getBySlug(req: Request, res: Response): Promise<Response>;

    /**
     * Update an item by ObjectId.
     *
     * @param req - Express request with update payload.
     * @param res - Express response.
     */
    update(req: Request, res: Response): Promise<Response>;

    /**
     * Delete an item by ObjectId.
     *
     * @param req - Express request with `_id` route param.
     * @param res - Express response.
     */
    delete(req: Request, res: Response): Promise<Response>;

    /**
     * Execute a configurable aggregate query.
     *
     * @param req - Express request containing query parameters.
     * @param res - Express response.
     */
    query(req: Request, res: Response): Promise<Response>;

    /**
     * Parse and normalize query options from the request.
     *
     * @param req - Express request.
     * @returns Parsed query options.
     */
    fetchQueryOptions(req: Request): QueryOptionTypes<TSchema, TMatchFilters>;

    /**
     * Provide population-related aggregation pipeline stages.
     *
     * @returns Population pipeline stages.
     */
    fetchPopulatePipelines(): PopulationPipelineStages;
}

/**
 * Constructor parameters for CRUD controller implementations.
 *
 * @template TSchema - Document shape handled by the controller.
 */
export interface IBaseCRUDControllerConstructor<TSchema extends ModelObject>
    extends IBaseControllerConstructor
{
    /** Repository handling persistence operations. */
    repository: BaseRepository<TSchema>;

    /** Aggregate query execution service. */
    aggregateService: AggregateQueryService<TSchema>;
}
