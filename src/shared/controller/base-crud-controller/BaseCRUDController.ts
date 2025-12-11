/**
 * @file BaseCRUDController.ts
 * @summary
 * Generic controller implementing standard CRUD operations and
 * aggregation-based querying for Mongoose entities.
 *
 * @description
 * This class centralizes all reusable controller behavior:
 * - Basic CRUD (find, create, update, delete)
 * - Pagination utilities
 * - Population/virtual field control
 * - Aggregate pipeline queries via {@link AggregateQueryService}
 *
 * Designed to be subclassed per entity while keeping controllers thin,
 * predictable, and consistent.
 */

import {type Request, type Response} from "express";
import type BaseRepository from "../../repository/BaseRepository.js";
import BaseController from "../BaseController.js";
import isValidObjectId from "../../utility/mongoose/isValidObjectId.js";
import type {PopulationPipelineStages} from "../../types/mongoose/AggregatePipelineStages.js";
import type AggregateQueryService from "../../services/aggregate/AggregateQueryService.js";
import type {AggregateQueryParams} from "../../services/aggregate/AggregateQueryService.types.js";
import type {
    BaseControllerCRUDMethods,
    IBaseCRUDControllerConstructor,
} from "./BaseControllerCRUDMethods.js";
import type {QueryOptionTypes} from "../../types/query-options/QueryOptionService.types.js";
import {Types} from "mongoose";

/**
 * Base controller implementing CRUD and aggregation utilities.
 *
 * @typeParam TSchema - Mongoose document type with required `_id`.
 * @typeParam TMatchFilters - Shape of match filters parsed for queries.
 */
export default class BaseCRUDController<
    TSchema extends { _id: Types.ObjectId },
    TMatchFilters = any,
> extends BaseController implements BaseControllerCRUDMethods<TSchema, TMatchFilters> {
    /** Repository providing the entity’s CRUD operations. */
    protected readonly repository: BaseRepository<TSchema>;

    /** Aggregation service offering pipeline, filtering, sorting, and pagination. */
    protected readonly aggregateService: AggregateQueryService<TSchema>;

    /**
     * Creates a new CRUD controller instance.
     *
     * @param params - Includes repository, aggregate service, and BaseController options.
     */
    constructor(params: IBaseCRUDControllerConstructor<TSchema>) {
        const {repository, aggregateService, ...superParams} = params;
        super(superParams);

        this.repository = repository;
        this.aggregateService = aggregateService;
    }

    /**
     * Retrieve all items, with optional population, virtuals, and limits.
     *
     * @returns A JSON array of all matching items.
     */
    async all(req: Request, res: Response): Promise<Response> {
        const {populate, virtuals, limit} = this.queryUtils.fetchOptionsFromQuery(req);
        const items = await this.repository.find({options: {populate, virtuals, limit}});
        return res.status(200).json(items);
    }

    /**
     * Retrieve paginated items.
     *
     * @returns A JSON object containing `totalItems` and the current page of items.
     */
    async paginated(req: Request, res: Response): Promise<Response> {
        const {populate, virtuals} = this.queryUtils.fetchOptionsFromQuery(req);
        const {page, perPage} = this.queryUtils.fetchPaginationFromQuery(req);

        const totalItems = await this.repository.count();
        const items = await this.repository.paginate({
            page,
            perPage,
            options: {populate, virtuals},
        });

        return res.status(200).json({totalItems, items});
    }

    /**
     * Create a new item from the validated request body.
     *
     * @returns A JSON object containing the newly created item.
     */
    async create(req: Request, res: Response): Promise<Response> {
        const {populate, virtuals} = this.queryUtils.fetchOptionsFromQuery(req);
        const data = req.validatedBody as Partial<TSchema>;

        const item = await this.repository.create({data, options: {populate, virtuals}});
        return res.status(200).json(item);
    }

    /**
     * Retrieve a single item by its MongoDB `_id`.
     *
     * @throws If the provided `_id` is invalid.
     */
    async get(req: Request, res: Response): Promise<Response> {
        const {_id: entityID} = req.params;
        const _id = isValidObjectId(entityID);
        const {populate, virtuals} = this.queryUtils.fetchOptionsFromQuery(req);

        const item = await this.repository.findById({_id, options: {populate, virtuals}});
        return res.status(200).json(item);
    }

    /**
     * Update an item by its MongoDB `_id` using validated body data.
     *
     * @throws If the provided `_id` is invalid.
     */
    async update(req: Request, res: Response): Promise<Response> {
        const {_id: entityID} = req.params;
        const _id = isValidObjectId(entityID);

        const data = req.validatedBody!;
        const unset = req.unsetFields;
        const {populate, virtuals} = this.queryUtils.fetchOptionsFromQuery(req);

        const item = await this.repository.update({_id, data, unset, options: {populate, virtuals}});
        return res.status(200).json(item);
    }

    /**
     * Delete an item by its MongoDB `_id`.
     *
     * @throws If the provided `_id` is invalid.
     */
    async delete(req: Request, res: Response): Promise<Response> {
        const {_id: entityID} = req.params;
        const _id = isValidObjectId(entityID);

        await this.repository.destroy({_id});
        return res.status(200).json({message: "Deleted."});
    }

    /**
     * Execute an aggregate query with filters, sorts, pipelines, and pagination.
     *
     * @returns A JSON response containing aggregated results.
     */
    async query(req: Request, res: Response): Promise<Response> {
        const {paginated, ...optionParams} = this.queryUtils.fetchOptionsFromQuery(req);
        const paginationParams = this.queryUtils.fetchPaginationFromQuery(req);

        const baseParams = {
            ...optionParams,
            options: this.fetchQueryOptions(req),
            populationPipelines: this.fetchPopulatePipelines(),
        };

        const queryParams: AggregateQueryParams<TSchema, TMatchFilters> = paginated
            ? {...baseParams, paginated: true, ...paginationParams}
            : {...baseParams, paginated: false};

        const data = await this.aggregateService.query(queryParams);
        return res.status(200).json(data);
    }

    /**
     * Build query-option metadata (filters, sorts, etc.).
     * Override in subclasses to support entity-specific logic.
     */
    fetchQueryOptions(req: Request): QueryOptionTypes<TSchema, TMatchFilters> {
        return {
            match: {filters: {}, sorts: {}},
        };
    }

    /**
     * Build population pipeline stages for aggregate queries.
     * Override in subclasses to support entity-specific lookups.
     */
    fetchPopulatePipelines(): PopulationPipelineStages {
        return [];
    }
}
