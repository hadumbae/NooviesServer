import type {Request, Response} from "express";
import type {FilterQuery} from "mongoose";
import type {
    PopulationPipelineStages,
    ReferenceFilterPipelineStages
} from "../../types/mongoose/AggregatePipelineStages.js";
import type {IBaseControllerConstructor} from "../BaseController.js";
import type BaseRepository from "../../repository/BaseRepository.js";
import type AggregateQueryService from "../../services/aggregate/AggregateQueryService.js";

/**
 * Interface defining standard CRUD controller methods and query helpers.
 *
 * @typeParam TSchema - The schema type handled by the controller.
 * @typeParam TMatchFilters - Optional type used for query match filters.
 */
export interface IBaseCRUDController<
    TSchema = Record<string, any>,
    TMatchFilters = any,
> {
    /**
     * Retrieves all items with optional query options.
     *
     * @param req - Express request object.
     * @param res - Express response object.
     * @returns A promise resolving to the Express response.
     */
    all(req: Request, res: Response): Promise<Response>;

    /**
     * Retrieves items in a paginated format.
     *
     * @param req - Express request object.
     * @param res - Express response object.
     * @returns A promise resolving to the Express response.
     */
    paginated(req: Request, res: Response): Promise<Response>;

    /**
     * Creates a new item.
     *
     * @param req - Express request object containing validated body.
     * @param res - Express response object.
     * @returns A promise resolving to the Express response with the created item.
     */
    create(req: Request, res: Response): Promise<Response>;

    /**
     * Retrieves a single item by ID.
     *
     * @param req - Express request object.
     * @param res - Express response object.
     * @returns A promise resolving to the Express response with the item.
     */
    get(req: Request, res: Response): Promise<Response>;

    /**
     * Updates an existing item by ID.
     *
     * @param req - Express request object containing validated body.
     * @param res - Express response object.
     * @returns A promise resolving to the Express response with the updated item.
     */
    update(req: Request, res: Response): Promise<Response>;

    /**
     * Deletes an item by ID.
     *
     * @param req - Express request object.
     * @param res - Express response object.
     * @returns A promise resolving to the Express response indicating deletion.
     */
    delete(req: Request, res: Response): Promise<Response>;

    /**
     * Executes an aggregate query with optional pagination, filters, and population pipelines.
     *
     * @param req - Express request object.
     * @param res - Express response object.
     * @returns A promise resolving to the Express response with query results.
     */
    query(req: Request, res: Response): Promise<Response>;

    /**
     * Extracts Mongoose match filters from the request URL.
     * Override in subclasses to implement custom filter logic.
     *
     * @param req - Express request object.
     * @returns A Mongoose filter query object.
     */
    fetchURLMatchFilters(req: Request): FilterQuery<TMatchFilters>;

    /**
     * Extracts Mongoose populate filters from the request URL.
     * Override in subclasses to implement custom population logic.
     *
     * @param req - Express request object.
     * @returns An array of Mongoose population pipeline stages.
     */
    fetchURLPopulateFilters(req: Request): ReferenceFilterPipelineStages;

    /**
     * Provides default Mongoose populate pipelines.
     * Override in subclasses to add virtuals or related document pipelines.
     *
     * @returns An array of Mongoose population pipeline stages.
     */
    fetchPopulatePipelines(): PopulationPipelineStages;
}

/**
 * Interface for constructing a BaseCRUDController.
 *
 * @typeParam TSchema - The schema type handled by the controller.
 * @typeParam TMatchFilters - Optional type used for query match filters.
 */
export interface IBaseCRUDControllerConstructor<
    TSchema extends Record<string, any>,
    TMatchFilters = any,
> extends IBaseControllerConstructor {
    /** Repository instance used for CRUD operations. */
    repository: BaseRepository<TSchema>;

    /** Aggregate query service used for advanced queries and pipelines. */
    aggregateService: AggregateQueryService<TSchema>;
}