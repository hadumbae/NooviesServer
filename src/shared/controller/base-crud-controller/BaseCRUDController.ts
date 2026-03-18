/**
 * @file Generic CRUD controller with aggregate-query support.
 * @filename BaseCRUDController.ts
 */

import {type Request, type Response} from "express";
import type {BaseRepository} from "../../repository/BaseRepository.js";
import BaseController from "../BaseController.js";
import isValidObjectId from "../../utility/mongoose/isValidObjectId.js";
import type {PopulationPipelineStages} from "../../types/mongoose/AggregatePipelineStages.js";
import type AggregateQueryService from "../../services/aggregate/AggregateQueryService.js";
import type {
    BaseControllerCRUDMethods,
    BaseCRUDControllerConstructorParams,
} from "./BaseControllerCRUDMethods.js";
import type {QueryOptionTypes} from "../../types/query-options/QueryOptionService.types.js";
import type {ModelObject} from "../../types/ModelObject.js";
import type {AggregateQueryParams} from "../../services/aggregate/AggregateQueryService.types.js";

/**
 * Base CRUD controller providing standardized Express handlers.
 * * * Supports pagination, population, and complex aggregation pipelines.
 * * Designed to be extended by domain-specific controllers (e.g., `ShowingController`).
 * * @template TSchema - Document shape handled by the controller, extending {@link ModelObject}.
 * @template TMatchFilters - Shape of match filters for {@link AggregateQueryService}.
 * @template TInput - Input DTO shape for creation and updates.
 */
export default class BaseCRUDController<
    TSchema extends ModelObject,
    TMatchFilters = unknown,
    TInput = unknown
> extends BaseController
    implements BaseControllerCRUDMethods<TSchema, TMatchFilters> {

    /** {@link BaseRepository} handling database persistence. */
    protected readonly repository: BaseRepository<TSchema, TInput>;

    /** {@link AggregateQueryService} for complex read operations. */
    protected readonly aggregateService: AggregateQueryService<TSchema>;

    /**
     * Initializes the controller with required services.
     */
    constructor(params: BaseCRUDControllerConstructorParams<TSchema>) {
        const {repository, aggregateService, ...superParams} = params;
        super(superParams);

        this.repository = repository;
        this.aggregateService = aggregateService;
    }

    /**
     * Fetches all records using {@link BaseRepository.find}.
     */
    async all(req: Request, res: Response): Promise<Response> {
        const {populate, virtuals, limit} = this.queryUtils.fetchOptionsFromQuery(req);
        const items = await this.repository.find({options: {populate, virtuals, limit}});
        return res.status(200).json(items);
    }

    /**
     * Fetches a paginated subset of records and total count.
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
     * Creates a new document using validated body data.
     */
    async create(req: Request, res: Response): Promise<Response> {
        const {populate, virtuals} = this.queryUtils.fetchOptionsFromQuery(req);
        const data = req.validatedBody as Partial<TInput>;

        const item = await this.repository.create({data, options: {populate, virtuals}});
        return res.status(200).json(item);
    }

    /**
     * Retrieves a single record by `_id`.
     * @throws `InvalidObjectIdError` If params do not contain a valid MongoDB {@link Types.ObjectId}.
     */
    async get(req: Request, res: Response): Promise<Response> {
        const {_id: entityID} = req.params;
        const _id = isValidObjectId(entityID);
        const {populate, virtuals} = this.queryUtils.fetchOptionsFromQuery(req);

        const item = await this.repository.findById({_id, options: {populate, virtuals}});
        return res.status(200).json(item);
    }

    /**
     * Retrieves a single record by its unique `slug`.
     */
    async getBySlug(req: Request, res: Response): Promise<Response> {
        const {slug} = req.params;
        const {populate, virtuals} = this.queryUtils.fetchOptionsFromQuery(req);

        const item = await this.repository.findBySlug({slug, options: {populate, virtuals}});
        return res.status(200).json(item);
    }

    /**
     * Updates an existing document by `_id`.
     * @throws `InvalidObjectIdError` If the provided ID is malformed.
     */
    async update(req: Request, res: Response): Promise<Response> {
        const {_id: entityID} = req.params;
        const _id = isValidObjectId(entityID);

        const data = req.validatedBody as Partial<TInput>;
        const unset = req.unsetFields;
        const {populate, virtuals} = this.queryUtils.fetchOptionsFromQuery(req);

        const item = await this.repository.update({
            _id,
            data,
            unset,
            options: {populate, virtuals},
        });

        return res.status(200).json(item);
    }

    /**
     * Performs a permanent {@link BaseRepository.destroy} on a record.
     */
    async delete(req: Request, res: Response): Promise<Response> {
        const {_id: entityID} = req.params;
        const _id = isValidObjectId(entityID);

        await this.repository.destroy({_id});
        return res.status(200).json({message: "Deleted."});
    }

    /**
     * Performs a {@link BaseRepository.softDelete} by toggling lifecycle flags.
     */
    async softDelete(req: Request, res: Response): Promise<Response> {
        const {_id: entityID} = req.params;
        const _id = isValidObjectId(entityID);

        const item = await this.repository.softDelete({_id});
        return res.status(200).json(item);
    }

    /**
     * Executes an aggregation query using the {@link aggregateService}.
     * Handles both flat and paginated response shapes based on query string.
     */
    async query(req: Request, res: Response): Promise<Response> {
        const {paginated, ...config} = this.queryUtils.fetchOptionsFromQuery(req);
        const paginationParams = this.queryUtils.fetchPaginationFromQuery(req);

        const baseParams = {...config, options: this.fetchQueryOptions(req)};

        const queryParams: AggregateQueryParams<TSchema, TMatchFilters> = paginated
            ? {...baseParams, paginated: true, ...paginationParams}
            : {...baseParams, paginated: false};

        const data = await this.aggregateService.query(queryParams);
        return res.status(200).json(data);
    }

    /**
     * Generates {@link QueryOptionTypes} metadata.
     * * Should be overridden in subclasses to provide domain-specific filtering logic.
     */
    fetchQueryOptions(req: Request): QueryOptionTypes<TSchema, TMatchFilters> {
        return {
            match: {filters: {}, sorts: {}},
        };
    }

    /**
     * Generates {@link PopulationPipelineStages} for aggregate queries.
     * * Override in subclasses to add `$lookup` stages.
     */
    fetchPopulatePipelines(): PopulationPipelineStages {
        return [];
    }
}