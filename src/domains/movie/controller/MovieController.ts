import BaseController, {
    type IBaseController,
    type IBaseControllerConstructor
} from "../../../shared/controller/BaseController.js";

import type {Request, Response} from "express";
import type IMovie from "../model/IMovie.js";
import MovieImageService, {type IMovieImageService} from "../service/MovieImageService.js";
import type IMovieService from "../interface/service/IMovieService.js";
import type IMovieQueryService from "../interface/service/IMovieQueryService.js";
import type MovieService from "../service/MovieService.js";
import type MovieQueryService from "../service/MovieQueryService.js";

export interface IMovieControllerConstructor extends IBaseControllerConstructor<IMovie> {
    service: IMovieService;
    queryService: IMovieQueryService;
    imageService: IMovieImageService,
}

export interface IMovieController extends IBaseController {
    updatePosterPicture(req: Request, res: Response): Promise<Response>,

    fetchMoviesByQueryWithData(req: Request, res: Response): Promise<Response>,
}

export default class MovieController extends BaseController<IMovie> implements IMovieController {
    private service: MovieService;
    private queryService: MovieQueryService;
    private imageService: MovieImageService;

    constructor(params: IMovieControllerConstructor) {
        const {
            service,
            queryService,
            imageService,
            ...constructorParams
        } = params;

        super(constructorParams);

        this.service = service;
        this.queryService = queryService;
        this.imageService = imageService;
    }

    async updatePosterPicture(req: Request, res: Response): Promise<Response> {
        const {_id} = req.params;
        const file = req.file as Express.Multer.File;

        const movie = await this.imageService.updateMoviePosterImage({movieID: _id, image: file});

        return res.status(200).json({
            message: "Poster Image Updated.",
            data: movie,
        });
    }

    async fetchMoviesByQueryWithData(req: Request, res: Response): Promise<Response> {
        const {page, perPage} = this.queryUtils.fetchPaginationFromQuery(req);

        const query = this.queryService.getFilterQuery(req);
        const sort = this.queryService.getSortQuery(req);

        const {items, totalItems} = await this.service.fetchPaginatedMoviesByQueryWithData({
            page,
            perPage,
            query,
            sort,
        });

        return res.status(200).json({items, totalItems});
    }
}