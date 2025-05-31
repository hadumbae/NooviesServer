import {type Request, type Response} from "express";
import type BaseRepository from "../repository/BaseRepository.js";
import type {PaginationRequest} from "../types/request/CustomRequestTypes.js";
import BaseController, {type IBaseControllerConstructor} from "./BaseController.js";
import isValidObjectId from "../utility/query/isValidObjectId.js";

export interface IBaseCRUDController {
    all(req: Request, res: Response): Promise<Response>;
    paginated(req: PaginationRequest, res: Response): Promise<Response>;
    create(req: Request, res: Response): Promise<Response>;
    get(req: Request, res: Response): Promise<Response>;
    update(req: Request, res: Response): Promise<Response>;
    delete(req: Request, res: Response): Promise<Response>;
}

export interface IBaseCRUDControllerConstructor<TSchema extends Record<string, any>> extends IBaseControllerConstructor {
    repository: BaseRepository<TSchema>;
}

export default class BaseCRUDController<TSchema extends Record<string, any>> extends BaseController implements IBaseCRUDController {
    protected readonly repository: BaseRepository<TSchema>;

    constructor({repository, queryUtils}: IBaseCRUDControllerConstructor<TSchema>) {
        super({queryUtils});
        this.repository = repository;
    }

    async all(req: Request, res: Response): Promise<Response> {
        const {populate, virtuals} = this.queryUtils.fetchOptionsFromQuery(req);
        const items = await this.repository.find({populate, virtuals});
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

        const item = await this.repository.findById({
            _id: parsedID,
            populate,
            virtuals,
        });

        return res.status(200).json(item);
    }

    async update(req: Request, res: Response): Promise<Response> {
        const {_id} = req.params;
        const parsedID = isValidObjectId(_id);

        const data = req.validatedBody;
        const {populate, virtuals} = this.queryUtils.fetchOptionsFromQuery(req);

        const item = await this.repository.update({
            _id: parsedID,
            data,
            populate,
            virtuals,
        });

        return res.status(200).json(item);
    }

    async delete(req: Request, res: Response): Promise<Response> {
        const {_id} = req.params;
        await this.repository.destroy({_id});

        return res.status(200).json({message: "Deleted."});
    }
}