import {type Request, type Response} from "express";
import type BaseRepository from "../repository/BaseRepository.js";
import type {IPaginationUtils} from "../utility/PaginationUtils.js";
import type {PaginationRequest} from "../types/request/CustomRequestTypes.js";

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
    paginationUtils: IPaginationUtils;
}

export default class BaseController<TModel> implements IBaseController {
    private readonly repository: BaseRepository<TModel>;
    private readonly paginationUtils: IPaginationUtils;

    constructor(params: IBaseControllerConstructor<TModel>) {
        this.repository = params.repository;
        this.paginationUtils = params.paginationUtils;
    }

    async all(_req: Request, res: Response): Promise<Response> {
        const items = await this.repository.find();
        return res.status(200).json({
            message: "Data fetched.",
            data: items
        });
    }

    async paginated(req: PaginationRequest, res: Response): Promise<Response> {
        const {page, perPage} = this.paginationUtils.fetchPaginationFromQuery(req);
        const totalItems = await this.repository.count();
        const items = await this.repository.paginate({page, perPage});

        return res.status(200).json({
            message: "Data fetched.",
            data: {totalItems, items},
        });
    }

    async create(req: Request, res: Response): Promise<Response> {
        const data = req.body;
        const item = await this.repository.create({data})

        return res.status(200).json({
            message: "Created.",
            data: item,
        });
    }

    async get(req: Request, res: Response): Promise<Response> {
        const {_id} = req.body;
        const item = this.repository.findById(_id);
        return res.status(200).json({
           message: "Data fetched.",
           data: item,
        });
    }

    async update(req: Request, res: Response): Promise<Response> {
        const {_id} = req.params;
        const data = req.body;
        const item = await this.repository.findByIdAndUpdate({_id, data});

        return res.status(200).json({
            message: "Updated.",
            data: item,
        });
    }

    async delete(req: Request, res: Response): Promise<Response> {
        const {_id} = req.params;
        await this.repository.findByIdAndDelete({_id});

        return res.status(200).json({
            message: "Deleted."
        });
    }
}