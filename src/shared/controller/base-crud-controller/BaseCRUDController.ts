import {type Request, type Response} from "express";
import type BaseRepository from "../../repository/BaseRepository.js";
import BaseController from "../BaseController.js";
import isValidObjectId from "../../utility/query/isValidObjectId.js";
import type {FilterQuery} from "mongoose";
import type {
    PopulationPipelineStages,
    ReferenceFilterPipelineStages
} from "../../types/mongoose/AggregatePipelineStages.js";
import type AggregateQueryService from "../../services/aggregate/AggregateQueryService.js";
import type {AggregateQueryParams} from "../../services/aggregate/AggregateQueryServiceTypes.js";
import type {IBaseCRUDController, IBaseCRUDControllerConstructor} from "./BaseCRUDController.types.js";

/**
 * A generic base controller providing standard CRUD operations
 * and query support for Mongoose-based entities.
 *
 * @typeParam TSchema - The schema type handled by the controller.
 * @typeParam TMatchFilters - Optional type used for query match filters.
 */
export default class BaseCRUDController<TSchema extends Record<string, any>, TMatchFilters = any>
    extends BaseController
    implements IBaseCRUDController<TSchema, TMatchFilters>
{
    /** Repository instance for database interaction. */
    protected readonly repository: BaseRepository<TSchema>;

    /** Aggregate query service for handling complex queries with pipelines. */
    protected readonly aggregateService: AggregateQueryService<TSchema>;

    /**
     * Creates a new instance of `BaseCRUDController`.
     *
     * @param params - Constructor parameters including repository, aggregate service, and BaseController options.
     */
    constructor(params: IBaseCRUDControllerConstructor<TSchema, TMatchFilters>) {
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
     * @returns A response containing the list of items.
     */
    async all(req: Request, res: Response): Promise<Response> {
        const { populate, virtuals, limit } =
            this.queryUtils.fetchOptionsFromQuery(req);

        const items = await this.repository.find({ populate, virtuals, limit });
        return res.status(200).json(items);
    }

    /**
     * Retrieves a paginated list of items.
     *
     * @param req - Express request object.
     * @param res - Express response object.
     * @returns A response containing total item count and paginated items.
     */
    async paginated(req: Request, res: Response): Promise<Response> {
        const { populate, virtuals } = this.queryUtils.fetchOptionsFromQuery(req);
        const { page, perPage } = this.queryUtils.fetchPaginationFromQuery(req);

        const totalItems = await this.repository.count();
        const items = await this.repository.paginate({
            page,
            perPage,
            populate,
            virtuals,
        });

        return res.status(200).json({ totalItems, items });
    }

    /**
     * Creates a new item using validated request body.
     *
     * @param req - Express request object.
     * @param res - Express response object.
     * @returns A response containing the created item.
     */
    async create(req: Request, res: Response): Promise<Response> {
        const { populate, virtuals } = this.queryUtils.fetchOptionsFromQuery(req);
        const data = req.validatedBody;

        const item = await this.repository.create({ data, populate, virtuals });

        return res.status(200).json(item);
    }

    /**
     * Retrieves a single item by its ID.
     *
     * @param req - Express request object.
     * @param res - Express response object.
     * @returns A response containing the found item.
     * @throws If `_id` is not a valid MongoDB ObjectId.
     */
    async get(req: Request, res: Response): Promise<Response> {
        const { _id } = req.params;
        const parsedID = isValidObjectId(_id);
        const { populate, virtuals } = this.queryUtils.fetchOptionsFromQuery(req);

        const item = await this.repository.findById({
            _id: parsedID,
            populate,
            virtuals,
        });

        return res.status(200).json(item);
    }

    /**
     * Updates an existing item by ID.
     *
     * @param req - Express request object.
     * @param res - Express response object.
     * @returns A response containing the updated item.
     * @throws If `_id` is not a valid MongoDB ObjectId.
     */
    async update(req: Request, res: Response): Promise<Response> {
        const { _id } = req.params;
        const parsedID = isValidObjectId(_id);

        const data = req.validatedBody;
        const { populate, virtuals } = this.queryUtils.fetchOptionsFromQuery(req);

        const item = await this.repository.update({
            _id: parsedID,
            data,
            populate,
            virtuals,
        });

        return res.status(200).json(item);
    }

    /**
     * Deletes an item by ID.
     *
     * @param req - Express request object.
     * @param res - Express response object.
     * @returns A success response indicating deletion.
     * @throws If `_id` is not a valid MongoDB ObjectId.
     */
    async delete(req: Request, res: Response): Promise<Response> {
        const { _id } = req.params;
        const parsedID = isValidObjectId(_id);

        await this.repository.destroy({ _id: parsedID });

        return res.status(200).json({ message: "Deleted." });
    }

    /**
     * Executes an aggregate query with support for pagination, filters,
     * and population pipelines.
     *
     * @param req - Express request object.
     * @param res - Express response object.
     * @returns A response containing aggregate query results.
     */
    async query(req: Request, res: Response): Promise<Response> {
        const { paginated, ...optionParams } =
            this.queryUtils.fetchOptionsFromQuery(req);
        const paginationParams = this.queryUtils.fetchPaginationFromQuery(req);

        const matchFilters = this.fetchURLMatchFilters(req);
        const populateFilters = this.fetchURLPopulateFilters(req);
        const populatePipelines = this.fetchPopulatePipelines();

        const countParams = { matchFilters, populateFilters };
        const baseParams = { ...optionParams, ...countParams, populatePipelines };
        const queryParams: AggregateQueryParams = paginated
            ? { ...baseParams, paginated: true, ...paginationParams }
            : { ...baseParams, paginated: false };

        const data = await this.aggregateService.query(queryParams);

        return res.status(200).json(data);
    }

    /**
     * Extracts query match filters from the request URL.
     * Override in subclasses to provide custom filter logic.
     *
     * @param req - Express request object.
     * @returns A Mongoose filter query.
     */
    fetchURLMatchFilters(req: Request): FilterQuery<TMatchFilters> {
        return {};
    }

    /**
     * Extracts populate filters from the request URL.
     * Override in subclasses to provide custom population filters.
     *
     * @param req - Express request object.
     * @returns An array of Mongoose population pipeline stages.
     */
    fetchURLPopulateFilters(req: Request): ReferenceFilterPipelineStages {
        return [];
    }

    /**
     * Provides default populate pipelines.
     * Override in subclasses to add related documents or virtuals.
     *
     * @returns An array of Mongoose population pipeline stages.
     */
    fetchPopulatePipelines(): PopulationPipelineStages {
        return [];
    }
}