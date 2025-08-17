import BaseCRUDController, {
    type IBaseCRUDController,
    type IBaseCRUDControllerConstructor
} from "../../../shared/controller/BaseCRUDController.js";

import type {Request, Response} from "express";
import type IMovie from "../model/Movie.interface.js";
import MovieImageService from "../service/MovieImageService.js";
import type IMovieService from "../interface/service/IMovieService.js";
import type MovieService from "../service/MovieService.js";
import type MovieQueryService from "../service/MovieQueryService.js";
import isValidObjectId from "../../../shared/utility/query/isValidObjectId.js";
import type {FilterQuery} from "mongoose";

export interface IMovieControllerConstructor extends IBaseCRUDControllerConstructor<IMovie> {
    service: IMovieService;
    queryService: MovieQueryService;
    imageService: MovieImageService,
}

export interface IMovieController extends IBaseCRUDController {
    updatePosterPicture(req: Request, res: Response): Promise<Response>,
    fetchMoviesByQueryWithData(req: Request, res: Response): Promise<Response>,
}

export default class MovieController extends BaseCRUDController<IMovie> implements IMovieController {
    private service: MovieService;
    private queryService: MovieQueryService;
    private imageService: MovieImageService;

    constructor(params: IMovieControllerConstructor) {
        const {service, queryService, imageService, ...constructorParams} = params;

        super(constructorParams);

        this.service = service;
        this.queryService = queryService;
        this.imageService = imageService;
    }

    async all(req: Request, res: Response): Promise<Response> {
        const {populate, virtuals} = this.queryUtils.fetchOptionsFromQuery(req);
        const filterQuery  = this.queryService.getFilterQuery(req);

        const items = await this.repository.find({populate, virtuals, filters: filterQuery});
        return res.status(200).json(items);
    }

    fetchURLMatchFilters(req: Request): FilterQuery<any> {
        return this.queryService.getFilterQuery(req);
    }

    async updatePosterPicture(req: Request, res: Response): Promise<Response> {
        const {_id} = req.params;

        const movieID = isValidObjectId(_id);
        const image = req.file as Express.Multer.File;
        await this.imageService.updateMoviePosterImage({movieID, image});

        return res
            .status(200)
            .json({message: "Poster Image Updated."});
    }

    async deletePosterPicture(req: Request, res: Response): Promise<Response> {
        const {_id} = req.params;

        const movieID = isValidObjectId(_id);
        await this.imageService.deleteMoviePosterImage({movieID});

        return res
            .status(200)
            .json({message: "Poster Image Removed."});
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