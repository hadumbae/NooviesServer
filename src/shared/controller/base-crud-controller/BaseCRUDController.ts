import {type Request, type Response} from "express";
import type BaseRepository from "../../repository/BaseRepository.js";
import BaseController from "../BaseController.js";
import isValidObjectId from "../../utility/query/isValidObjectId.js";
import type {
    PopulationPipelineStages,
} from "../../types/mongoose/AggregatePipelineStages.js";
import type AggregateQueryService from "../../services/aggregate/AggregateQueryService.js";
import type {AggregateQueryParams} from "../../services/aggregate/AggregateQueryService.types.js";
import type {IBaseCRUDController, IBaseCRUDControllerConstructor} from "./BaseCRUDController.types.js";
import type {QueryOptionTypes} from "../../types/query-options/QueryOptionService.types.js";

/**
 * A generic base controller providing standard CRUD operations
 * and aggregation query support for Mongoose-based entities.
 *
 * Designed for reuse across different entity controllers by
 * delegating persistence logic to a {@link BaseRepository} and
 * advanced querying to an {@link AggregateQueryService}.
 *
 * @typeParam TSchema - The schema type handled by the controller.
 * @typeParam TMatchFilters - The type representing query match filters.
 */
export default class BaseCRUDController<
    TSchema extends Record<string, any>,
    TMatchFilters = any,
> extends BaseController implements IBaseCRUDController<TSchema, TMatchFilters> {
    /** Repository instance for direct database interactions (create, read, update, delete). */
    protected readonly repository: BaseRepository<TSchema>;

    /** Aggregate query service for handling queries that require pipelines, population, and pagination. */
    protected readonly aggregateService: AggregateQueryService<TSchema>;

    /**
     * Creates a new instance of {@link BaseCRUDController}.
     *
     * @param params - Constructor parameters including the repository, aggregate service,
     * and options passed to the {@link BaseController}.
     */
    constructor(params: IBaseCRUDControllerConstructor<TSchema>) {
        const {repository, aggregateService, ...superParams} = params;

        super(superParams);

        this.repository = repository;
        this.aggregateService = aggregateService;
    }

    /**
     * Retrieves all items with optional population, virtuals, and limit options.
     *
     * @param req - Express request object.
     * @param res - Express response object.
     * @returns A JSON response containing all items.
     */
    async all(req: Request, res: Response): Promise<Response> {
        const {populate, virtuals, limit} = this.queryUtils.fetchOptionsFromQuery(req);
        const items = await this.repository.find({populate, virtuals, limit});
        return res.status(200).json(items);
    }

    /**
     * Retrieves a paginated list of items.
     *
     * @param req - Express request object.
     * @param res - Express response object.
     * @returns A JSON response containing total item count and the paginated items.
     */
    async paginated(req: Request, res: Response): Promise<Response> {
        const {populate, virtuals} = this.queryUtils.fetchOptionsFromQuery(req);
        const {page, perPage} = this.queryUtils.fetchPaginationFromQuery(req);

        const totalItems = await this.repository.count();
        const items = await this.repository.paginate({
            page,
            perPage,
            populate,
            virtuals,
        });

        return res.status(200).json({totalItems, items});
    }

    /**
     * Creates a new item using validated request body.
     *
     * @param req - Express request object containing a validated body (`req.validatedBody`).
     * @param res - Express response object.
     * @returns A JSON response containing the created item.
     */
    async create(req: Request, res: Response): Promise<Response> {
        const {populate, virtuals} = this.queryUtils.fetchOptionsFromQuery(req);
        const data = req.validatedBody as Partial<TSchema>;

        const item = await this.repository.create({data, populate, virtuals});

        return res.status(200).json(item);
    }

    /**
     * Retrieves a single item by its MongoDB `_id`.
     *
     * @param req - Express request object containing `_id` in params.
     * @param res - Express response object.
     * @returns A JSON response containing the found item.
     * @throws If `_id` is not a valid MongoDB ObjectId.
     */
    async get(req: Request<TSchema>, res: Response): Promise<Response> {
        const {_id: entityID} = req.params;
        const _id = isValidObjectId(entityID);
        const {populate, virtuals} = this.queryUtils.fetchOptionsFromQuery(req);

        const item = await this.repository.findById({_id, populate, virtuals});

        return res.status(200).json(item);
    }

    /**
     * Updates an existing item by its MongoDB `_id`.
     *
     * @param req - Express request object containing `_id` in params and validated body (`req.validatedBody`).
     * @param res - Express response object.
     * @returns A JSON response containing the updated item.
     * @throws If `_id` is not a valid MongoDB ObjectId.
     */
    async update(req: Request, res: Response): Promise<Response> {
        const {_id: entityID} = req.params;
        const _id = isValidObjectId(entityID);

        const data = req.validatedBody!;
        const unset = req.unsetFields;
        const {populate, virtuals} = this.queryUtils.fetchOptionsFromQuery(req);

        const item = await this.repository.update({_id, data, unset, populate, virtuals});

        return res.status(200).json(item);
    }

    /**
     * Deletes an item by its MongoDB `_id`.
     *
     * @param req - Express request object containing `_id` in params.
     * @param res - Express response object.
     * @returns A JSON response confirming deletion.
     * @throws If `_id` is not a valid MongoDB ObjectId.
     */
    async delete(req: Request, res: Response): Promise<Response> {
        const {_id: entityID} = req.params;
        const _id = isValidObjectId(entityID);

        await this.repository.destroy({_id});

        return res.status(200).json({message: "Deleted."});
    }

    /**
     * Executes an aggregate query using {@link AggregateQueryService}
     * with support for pagination, filters, and population pipelines.
     *
     * @param req - Express request object.
     * @param res - Express response object.
     * @returns A JSON response containing aggregate query results.
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
     * Builds query options for aggregate queries.
     * Override this in subclasses to provide entity-specific filters and sorts.
     *
     * @param req - Express request object.
     * @returns Query option types for the given request.
     */
    fetchQueryOptions(req: Request): QueryOptionTypes<TSchema, TMatchFilters> {
        return {
            match: {filters: {}, sorts: {}},
        };
    }

    /**
     * Builds population pipelines for aggregate queries.
     * Override this in subclasses to define custom population logic.
     *
     * @returns An array of population pipeline stages.
     */
    fetchPopulatePipelines(): PopulationPipelineStages {
        return [];
    }
}
