import {type Request, type Response} from "express";
import type BaseRepository from "../repository/BaseRepository.js";
import BaseController, {type IBaseControllerConstructor} from "./BaseController.js";
import isValidObjectId from "../utility/query/isValidObjectId.js";
import type {FilterQuery} from "mongoose";
import type {PopulatePipelineStages} from "../types/mongoose/PopulatePipelineStages.js";
import type AggregateQueryService from "../services/AggregateQueryService.js";

export interface IBaseCRUDController<TSchema = Record<string, any>, TMatchFilters = any> {
    all(req: Request, res: Response): Promise<Response>;

    paginated(req: Request, res: Response): Promise<Response>;

    create(req: Request, res: Response): Promise<Response>;

    get(req: Request, res: Response): Promise<Response>;

    update(req: Request, res: Response): Promise<Response>;

    delete(req: Request, res: Response): Promise<Response>;

    query(req: Request, res: Response): Promise<Response>;

    fetchURLMatchFilters(req: Request): FilterQuery<TMatchFilters>;

    fetchURLPopulateFilters(req: Request): PopulatePipelineStages;

    fetchPopulatePipelines(): PopulatePipelineStages;
}

export interface IBaseCRUDControllerConstructor<TSchema extends Record<string, any>, TMatchFilters = any> extends IBaseControllerConstructor {
    repository: BaseRepository<TSchema>;
    aggregateService: AggregateQueryService<TSchema, TMatchFilters>;
}

export default class BaseCRUDController<TSchema extends Record<string, any>, TMatchFilters = any> extends BaseController implements IBaseCRUDController<TSchema, TMatchFilters> {
    protected readonly repository: BaseRepository<TSchema>;
    protected readonly aggregateService: AggregateQueryService<TSchema, TMatchFilters>;

    constructor({repository, queryUtils, aggregateService}: IBaseCRUDControllerConstructor<TSchema, TMatchFilters>) {
        super({queryUtils});

        this.repository = repository;
        this.aggregateService = aggregateService;
    }

    async all(req: Request, res: Response):
        Promise<Response> {
        const {populate, virtuals, limit} = this.queryUtils.fetchOptionsFromQuery(req);

        const items = await this.repository.find({populate, virtuals, limit});
        return res.status(200).json(items);
    }

    async paginated(req: Request, res: Response): Promise<Response> {
        const {populate, virtuals} = this.queryUtils.fetchOptionsFromQuery(req);
        const {page, perPage} = this.queryUtils.fetchPaginationFromQuery(req);

        const totalItems = await this.repository.count();
        const items = await this.repository.paginate({page, perPage, populate, virtuals});

        return res.status(200).json({totalItems, items});
    }

    async create(req: Request, res: Response): Promise<Response> {
        const {populate, virtuals} = this.queryUtils.fetchOptionsFromQuery(req);
        const data = req.body;

        const item = await this.repository.create({data, populate, virtuals});

        return res.status(200).json(item);
    }

    async get(req: Request, res: Response): Promise<Response> {
        const {_id} = req.params;
        const parsedID = isValidObjectId(_id);

        const {populate, virtuals} = this.queryUtils.fetchOptionsFromQuery(req);

        const item = await this.repository.findById({_id: parsedID, populate, virtuals});

        return res.status(200).json(item);
    }

    async update(req: Request, res: Response): Promise<Response> {
        const {_id} = req.params;
        const parsedID = isValidObjectId(_id);

        const data = req.validatedBody;
        const {populate, virtuals} = this.queryUtils.fetchOptionsFromQuery(req);

        const item = await this.repository.update({_id: parsedID, data, populate, virtuals});

        return res.status(200).json(item);
    }

    async delete(req: Request, res: Response): Promise<Response> {
        const {_id} = req.params;
        const parsedID = isValidObjectId(_id);

        await this.repository.destroy({_id: parsedID});

        return res.status(200).json({message: "Deleted."});
    }

    async query(req: Request, res: Response): Promise<Response> {
        const optionParams = this.queryUtils.fetchOptionsFromQuery(req);
        const paginationParams = this.queryUtils.fetchPaginationFromQuery(req);
        const {paginated} = optionParams;

        const matchFilters = this.fetchURLMatchFilters(req);
        const populateFilters = this.fetchURLPopulateFilters(req);
        const populatePipelines = this.fetchPopulatePipelines();

        const aggregateParams = this.aggregateService.fetchAggregateParams({
            ...optionParams,
            ...paginationParams,
            matchFilters,
            populateFilters,
            populatePipelines
        });

        const data = await this.aggregateService.aggregate(aggregateParams);

        if (paginated) {
            const totalItems = await this.aggregateService.count({matchFilters, populateFilters});
            return res.status(200).json({totalItems, items: data});
        }

        return res.status(200).json(data);
    }

    fetchURLMatchFilters(req: Request): FilterQuery<TMatchFilters> {
        return {};
    }

    fetchURLPopulateFilters(req: Request): PopulatePipelineStages {
        return [];
    }

    fetchPopulatePipelines(): PopulatePipelineStages {
        return [];
    }
}