import {type Request, type Response} from "express";
import type BaseRepository from "../repository/BaseRepository.js";
import type {PaginationRequest} from "../types/request/CustomRequestTypes.js";
import {type IQueryUtils} from "../utility/query/QueryUtils.js";

export interface IBaseController {
    all(req: Request, res: Response): Promise<Response>;
    paginated(req: PaginationRequest, res: Response): Promise<Response>;
    create(req: Request, res: Response): Promise<Response>;
    get(req: Request, res: Response): Promise<Response>;
    update(req: Request, res: Response): Promise<Response>;
    delete(req: Request, res: Response): Promise<Response>;
}

export interface IBaseControllerConstructor<TModel> {
    repository: BaseRepository<TModel>;
    queryUtils: IQueryUtils;
}

export default class BaseController<TModel> implements IBaseController {
    protected readonly repository: BaseRepository<TModel>;
    protected readonly queryUtils: IQueryUtils;

    constructor(params: IBaseControllerConstructor<TModel>) {
        this.repository = params.repository;
        this.queryUtils = params.queryUtils;
    }

    async all(req: Request, res: Response): Promise<Response> {
        const populate = this.queryUtils.fetchPopulateFromQuery(req);
        const items = await this.repository.find({populate});
        return res.status(200).json(items);
    }

    async paginated(req: Request, res: Response): Promise<Response> {
        const populate = this.queryUtils.fetchPopulateFromQuery(req);
        const {page, perPage} = this.queryUtils.fetchPaginationFromQuery(req);

        const totalItems = await this.repository.count();
        const items = await this.repository.paginate({page, perPage, populate, lean: true});

        return res.status(200).json({totalItems, items});
    }

    async create(req: Request, res: Response): Promise<Response> {
        const populate = this.queryUtils.fetchPopulateFromQuery(req);
        const data = req.body;

        const item = await this.repository.create({data, populate});

        return res.status(200).json(item);
    }

    async get(req: Request, res: Response): Promise<Response> {
        const {_id} = req.params;
        const populate = this.queryUtils.fetchPopulateFromQuery(req);

        const item = await this.repository.findById({_id, populate, lean: true});

        return res.status(200).json(item);
    }

    async update(req: Request, res: Response): Promise<Response> {
        const {_id} = req.params;
        const data = req.validatedBody;
        const populate = this.queryUtils.fetchPopulateFromQuery(req);

        const item = await this.repository.update({_id, data, populate, lean: true});

        return res.status(200).json(item);
    }

    async delete(req: Request, res: Response): Promise<Response> {
        const {_id} = req.params;
        await this.repository.destroy({_id});

        return res.status(200).json({ message: "Deleted." });
    }
}