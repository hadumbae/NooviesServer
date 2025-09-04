import BaseCRUDController from "../../../shared/controller/base-crud-controller/BaseCRUDController.js";

import type {Request, Response} from "express";
import type IMovie from "../model/Movie.interface.js";
import MovieImageService from "../service/MovieImageService.js";
import type IMovieService from "../service/movie/IMovieService.js";
import type MovieService from "../service/movie/MovieService.js";
import type MovieQueryOptionService from "../service/MovieQueryOptionService.js";
import isValidObjectId from "../../../shared/utility/query/isValidObjectId.js";
import type {FilterQuery} from "mongoose";
import type {
    IBaseCRUDController,
    IBaseCRUDControllerConstructor
} from "../../../shared/controller/base-crud-controller/BaseCRUDController.types.js";

/**
 * Constructor parameters for {@link MovieController}.
 *
 * Extends the base CRUD controller constructor with movie-specific services.
 */
export interface IMovieControllerConstructor extends IBaseCRUDControllerConstructor<IMovie> {
    /** Service for movie CRUD operations. */
    service: IMovieService;

    /** Service for generating movie query filters and sorting. */
    optionService: MovieQueryOptionService;

    /** Service for managing movie poster images. */
    imageService: MovieImageService;
}

/**
 * Contract for a movie controller.
 *
 * Extends the base CRUD controller and adds movie-specific endpoints.
 */
export interface IMovieController extends IBaseCRUDController {
    /**
     * Updates the poster image for a movie.
     *
     * @param req - Express request (expects `params._id` and `file` for the new image)
     * @param res - Express response
     */
    updatePosterPicture(req: Request, res: Response): Promise<Response>;

    /**
     * Fetches a paginated list of movies along with their recent active showings.
     *
     * @param req - Express request (supports query parameters for pagination and filters)
     * @param res - Express response
     */
    fetchPaginatedMoviesWithRecentShowings(req: Request, res: Response): Promise<Response>;
}

/**
 * Controller for movie-related requests.
 *
 * Provides CRUD operations (inherited from {@link BaseCRUDController}) and
 * additional endpoints for managing poster images and fetching movies with
 * recent showings.
 */
export default class MovieController extends BaseCRUDController<IMovie> implements IMovieController {
    private service: MovieService;
    private queryService: MovieQueryOptionService;
    private imageService: MovieImageService;

    /**
     * Creates a new instance of {@link MovieController}.
     *
     * @param params - Constructor parameters including services and base CRUD options.
     */
    constructor(params: IMovieControllerConstructor) {
        const { service, optionService, imageService, ...constructorParams } = params;

        super(constructorParams);

        this.service = service;
        this.queryService = optionService;
        this.imageService = imageService;
    }

    /**
     * Generates MongoDB match filters based on query parameters in the request.
     *
     * @param req - Express request
     * @returns A filter query for movies
     */
    fetchURLMatchFilters(req: Request): FilterQuery<IMovie> {
        const options = this.queryService.fetchQueryParams(req);
        return this.queryService.generateMatchFilters(options);
    }

    /**
     * Updates the poster image of a movie.
     *
     * @param req - Express request (expects `params._id` and a `file` for the poster)
     * @param res - Express response
     * @returns A response indicating success
     */
    async updatePosterPicture(req: Request, res: Response): Promise<Response> {
        const { _id } = req.params;

        const movieID = isValidObjectId(_id);
        const image = req.file as Express.Multer.File;
        await this.imageService.updateMoviePosterImage({ movieID, image });

        return res.status(200).json({ message: "Poster Image Updated." });
    }

    /**
     * Deletes the poster image of a movie.
     *
     * @param req - Express request (expects `params._id`)
     * @param res - Express response
     * @returns A response indicating success
     */
    async deletePosterPicture(req: Request, res: Response): Promise<Response> {
        const { _id } = req.params;

        const movieID = isValidObjectId(_id);
        await this.imageService.deleteMoviePosterImage({ movieID });

        return res.status(200).json({ message: "Poster Image Removed." });
    }

    /**
     * Fetches a paginated list of movies with their recent active showings.
     *
     * @param req - Express request (supports query parameters for pagination, filters, and sorting)
     * @param res - Express response
     * @returns A JSON response containing `items` (movies) and `totalItems`
     */
    async fetchPaginatedMoviesWithRecentShowings(req: Request, res: Response): Promise<Response> {
        const { page, perPage } = this.queryUtils.fetchPaginationFromQuery(req);

        const params = this.queryService.fetchQueryParams(req);
        const query = this.queryService.generateMatchFilters(params);
        const sort = this.queryService.generateQuerySorts(params);

        const { items, totalItems } = await this.service.fetchPaginatedMoviesWithRecentShowings({
            page,
            perPage,
            query,
            sort,
        });

        return res.status(200).json({ items, totalItems });
    }
}