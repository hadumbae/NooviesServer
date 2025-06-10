import type {Request, Response} from "express";
import BaseCRUDController, {
    type IBaseCRUDController,
    type IBaseCRUDControllerConstructor
} from "../../../shared/controller/BaseCRUDController.js";
import type {IMovieCredit} from "../models/IMovieCredit.js";
import type MovieCreditQueryService from "../services/MovieCreditQueryService.js";
import type MovieCreditService from "../services/MovieCreditService.js";

export interface IMovieCreditControllerConstructor extends IBaseCRUDControllerConstructor<IMovieCredit> {
    service: MovieCreditService;
    queryService: MovieCreditQueryService;
}

export interface IMovieCreditController extends IBaseCRUDController {
    service: MovieCreditService;
    queryService: MovieCreditQueryService;

    all(req: Request, res: Response): Promise<Response>;
    paginated(req: Request, res: Response): Promise<Response>;
}

export default class MovieCreditController extends BaseCRUDController<IMovieCredit> implements IMovieCreditController {
    service: MovieCreditService;
    queryService: MovieCreditQueryService;

    constructor(params: IMovieCreditControllerConstructor) {
        const {service, queryService, ...superParams} = params;

        super(superParams);

        this.service = service;
        this.queryService = queryService;
    }

    async all(req: Request, res: Response): Promise<Response> {
        const {populate, limit} = this.queryUtils.fetchOptionsFromQuery(req);
        const queryParams  = this.queryService.fetchQueryParams(req);

        const matchFilters = this.queryService.generateMatchFilters(queryParams);
        const populateFilters = this.queryService.generatePopulateFilters(queryParams);

        const credits = await this.service.all({matchFilters, populateFilters, populate, limit});

        return res.status(200).json(credits);
    }

    async paginated(req: Request, res: Response): Promise<Response> {
        const {populate} = this.queryUtils.fetchOptionsFromQuery(req);
        const {page, perPage} = this.queryUtils.fetchPaginationFromQuery(req);

        const queryParams  = this.queryService.fetchQueryParams(req);
        const matchFilters = this.queryService.generateMatchFilters(queryParams);
        const populateFilters = this.queryService.generatePopulateFilters(queryParams);

        const count = await this.service.count({matchFilters, populateFilters});
        const credits = await this.service.paginate({
            page,
            perPage,
            matchFilters,
            populateFilters,
            populate,
        });

        return res.status(200).json({totalItems: count, items: credits});
    }
}