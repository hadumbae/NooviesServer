import BaseCRUDController from "../../../shared/controller/base-crud-controller/BaseCRUDController.js";
import type IGenre from "../model/Genre.interface.js";
import GenreService from "../service/GenreService.js";
import type {Request, Response} from "express";
import type GenreQueryOptionService from "../service/GenreQueryOptionService.js";
import type {FilterQuery} from "mongoose";
import type {GenreQueryFilters} from "../schema/options/GenreFilters.types.js";
import type {
    IBaseCRUDController,
    IBaseCRUDControllerConstructor
} from "../../../shared/controller/base-crud-controller/BaseCRUDController.types.js";

export interface IGenreController extends IBaseCRUDController {
}

export interface IGenreControllerConstructor extends IBaseCRUDControllerConstructor<IGenre> {
    genreService: GenreService;
    optionService: GenreQueryOptionService;
}

export default class GenreController extends BaseCRUDController<IGenre> implements IGenreController {
    genreService: GenreService;
    optionService: GenreQueryOptionService;

    constructor({genreService, optionService, ...superParams}: IGenreControllerConstructor) {
        super(superParams);

        this.genreService = genreService;
        this.optionService = optionService;
    }

    fetchURLMatchFilters(req: Request): FilterQuery<GenreQueryFilters> {
        const params = this.optionService.fetchQueryParams(req);
        return this.optionService.generateMatchFilters(params);
    }

    async create(req: Request, res: Response): Promise<Response> {
        const data = req.validatedBody;
        const item = await this.genreService.create({data});
        return res.status(200).json(item);
    }

    async update(req: Request, res: Response): Promise<Response> {
        const {_id} = req.params;
        const data = req.validatedBody;

        const item = await this.genreService.update({genreID: _id, data});
        return res.status(200).json(item);
    }
}
