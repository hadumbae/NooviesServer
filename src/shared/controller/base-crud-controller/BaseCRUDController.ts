/**
 * @file BaseCRUDController.ts
 *
 * Generic controller implementing CRUD and aggregate query operations.
 *
 * Centralizes reusable controller behavior:
 * - CRUD operations
 * - Pagination
 * - Population and virtual handling
 * - Aggregation-based querying
 *
 * Intended to be extended by entity-specific controllers.
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
import type {ModelObject} from "../../types/ModelObject.js";

/**
 * Base CRUD controller with aggregation support.
 *
 * @typeParam TSchema - Document shape handled by the controller.
 * @typeParam TMatchFilters - Shape of match filters used in aggregate queries.
 */
export default class BaseCRUDController<
    TSchema extends ModelObject,
    TMatchFilters = any,
> extends BaseController
    implements BaseControllerCRUDMethods<TSchema, TMatchFilters>
{
    /** Repository handling persistence operations. */
    protected readonly repository: BaseRepository<TSchema>;

    /** Service executing aggregate queries. */
    protected readonly aggregateService: AggregateQueryService<TSchema>;

    /**
     * Create a CRUD controller instance.
     *
     * @param params - Repository, aggregate service, and base controller options.
     */
    constructor(params: IBaseCRUDControllerConstructor<TSchema>) {
        const {repository, aggregateService, ...superParams} = params;
        super(superParams);

        this.repository = repository;
        this.aggregateService = aggregateService;
    }

    /**
     * Retrieve all items.
     */
    async all(req: Request, res: Response): Promise<Response> {
        const {populate, virtuals, limit} = this.queryUtils.fetchOptionsFromQuery(req);
        const items = await this.repository.find({options: {populate, virtuals, limit}});
        return res.status(200).json(items);
    }

    /**
     * Retrieve paginated items.
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
     * Create a new item.
     */
    async create(req: Request, res: Response): Promise<Response> {
        const {populate, virtuals} = this.queryUtils.fetchOptionsFromQuery(req);
        const data = req.validatedBody as Partial<TSchema>;

        const item = await this.repository.create({data, options: {populate, virtuals}});
        return res.status(200).json(item);
    }

    /**
     * Retrieve an item by ObjectId.
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
     * Retrieve an item by slug.
     */
    async getBySlug(req: Request, res: Response): Promise<Response> {
        const {slug} = req.params;
        const {populate, virtuals} = this.queryUtils.fetchOptionsFromQuery(req);

        const item = await this.repository.findBySlug({slug, options: {populate, virtuals}});
        return res.status(200).json(item);
    }

    /**
     * Update an item by ObjectId.
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
     * Delete an item by ObjectId.
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
     * Execute an aggregate query.
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
     * Build query-option metadata.
     *
     * Override in subclasses to support entity-specific filtering.
     */
    fetchQueryOptions(req: Request): QueryOptionTypes<TSchema, TMatchFilters> {
        return {
            match: {filters: {}, sorts: {}},
        };
    }

    /**
     * Build population pipelines for aggregate queries.
     *
     * Override in subclasses to support entity-specific lookups.
     */
    fetchPopulatePipelines(): PopulationPipelineStages {
        return [];
    }
}
