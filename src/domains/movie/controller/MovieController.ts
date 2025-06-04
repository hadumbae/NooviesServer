import BaseCRUDController, {
    type IBaseCRUDController,
    type IBaseCRUDControllerConstructor
} from "../../../shared/controller/BaseCRUDController.js";

import type {Request, Response} from "express";
import type IMovie from "../model/IMovie.js";
import MovieImageService, {type IMovieImageService} from "../service/MovieImageService.js";
import type IMovieService from "../interface/service/IMovieService.js";
import type IMovieURLService from "../interface/service/IMovieURLService.js";
import type MovieService from "../service/MovieService.js";
import type MovieURLService from "../service/MovieURLService.js";
import isValidObjectId from "../../../shared/utility/query/isValidObjectId.js";

export interface IMovieControllerConstructor extends IBaseCRUDControllerConstructor<IMovie> {
    service: IMovieService;
    urlService: IMovieURLService;
    imageService: IMovieImageService,
}

export interface IMovieController extends IBaseCRUDController {
    updatePosterPicture(req: Request, res: Response): Promise<Response>,

    fetchMoviesByQueryWithData(req: Request, res: Response): Promise<Response>,
}

export default class MovieController extends BaseCRUDController<IMovie> implements IMovieController {
    private service: MovieService;
    private urlService: MovieURLService;
    private imageService: MovieImageService;

    constructor(params: IMovieControllerConstructor) {
        const {
            service,
            urlService,
            imageService,
            ...constructorParams
        } = params;

        super(constructorParams);

        this.service = service;
        this.urlService = urlService;
        this.imageService = imageService;
    }

    async all(req: Request, res: Response): Promise<Response> {
        const {populate, virtuals} = this.queryUtils.fetchOptionsFromQuery(req);
        const filterQuery  = this.urlService.getFilterQuery(req);

        const items = await this.repository.find({populate, virtuals, filters: filterQuery});
        return res.status(200).json(items);
    }

    async updatePosterPicture(req: Request, res: Response): Promise<Response> {
        const {_id} = req.params;

        const movieID = isValidObjectId(_id);
        const image = req.file as Express.Multer.File;

        const movie = await this.imageService.updateMoviePosterImage({movieID, image});

        return res.status(200).json({
            message: "Poster Image Updated.",
            data: movie,
        });
    }

    async fetchMoviesByQueryWithData(req: Request, res: Response): Promise<Response> {
        const {page, perPage} = this.queryUtils.fetchPaginationFromQuery(req);

        const query = this.urlService.getFilterQuery(req);
        const sort = this.urlService.getSortQuery(req);

        const {items, totalItems} = await this.service.fetchPaginatedMoviesByQueryWithData({
            page,
            perPage,
            query,
            sort,
        });

        return res.status(200).json({items, totalItems});
    }
}