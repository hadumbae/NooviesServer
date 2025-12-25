import BaseCRUDController from "../../../shared/controller/base-crud-controller/BaseCRUDController.js";
import type { Request, Response } from "express";
import MovieImageService from "../service/MovieImageService.js";
import type IMovieService from "../service/movie/IMovieService.js";
import type MovieService from "../service/movie/MovieService.js";
import type MovieQueryOptionService from "../service/MovieQueryOptionService.js";
import isValidObjectId from "../../../shared/utility/mongoose/isValidObjectId.js";
import type {QueryOptionTypes} from "../../../shared/types/query-options/QueryOptionService.types.js";
import type {MovieQueryMatchFilters} from "../schema/query/MovieQueryOption.types.js";
import type {MovieSchemaFields} from "../model/Movie.types.js";
import type {
    BaseControllerCRUDMethods,
    IBaseCRUDControllerConstructor
} from "../../../shared/controller/base-crud-controller/BaseControllerCRUDMethods.js";

/**
 * Constructor parameters for {@link MovieController}.
 *
 * Extends the base CRUD controller constructor with movie-specific services.
 */
export interface IMovieControllerConstructor extends IBaseCRUDControllerConstructor<MovieSchemaFields> {
    /** Service for CRUD operations on movies. */
    service: IMovieService;

    /** Service for parsing query parameters and generating filters/sorts. */
    optionService: MovieQueryOptionService;

    /** Service for managing movie poster images. */
    imageService: MovieImageService;
}

/**
 * Interface for {@link MovieController}.
 *
 * Extends {@link BaseControllerCRUDMethods} with movie-specific endpoints:
 * - Updating/deleting poster images
 * - Fetching paginated movies with recent showings
 */
export interface IMovieController extends BaseControllerCRUDMethods<MovieSchemaFields, MovieQueryMatchFilters> {
    /**
     * Updates the poster image of a movie.
     *
     * @param req - Express request object containing `params._id` and `file`
     * @param res - Express response object
     */
    updatePosterPicture(req: Request, res: Response): Promise<Response>;

    /**
     * Deletes the poster image of a movie.
     *
     * @param req - Express request object containing `params._id`
     * @param res - Express response object
     */
    deletePosterPicture(req: Request, res: Response): Promise<Response>;

    /**
     * Fetches paginated movies along with recent active showings.
     *
     * @param req - Express request supporting query params for pagination, filtering, and sorting
     * @param res - Express response object
     */
    fetchPaginatedMoviesWithRecentShowings(req: Request, res: Response): Promise<Response>;
}

/**
 * Controller for handling movie-related requests.
 *
 * Extends {@link BaseCRUDController} for standard CRUD operations,
 * and adds endpoints for:
 * - Poster image management
 * - Paginated retrieval of movies with recent showings
 *
 * @example
 * // Update poster image:
 * // POST /movies/:id/poster (multipart/form-data with file)
 *
 * // Fetch paginated movies:
 * // GET /movies?page=1&perPage=10&title=Matrix&sortByReleaseDate=-1
 */
export default class MovieController extends BaseCRUDController<MovieSchemaFields> implements IMovieController {
    private service: MovieService;
    private optionService: MovieQueryOptionService;
    private imageService: MovieImageService;

    /**
     * Creates a new {@link MovieController}.
     *
     * @param params - Constructor parameters including base CRUD options and services
     */
    constructor(params: IMovieControllerConstructor) {
        const { service, optionService, imageService, ...constructorParams } = params;

        super(constructorParams);

        this.service = service;
        this.optionService = optionService;
        this.imageService = imageService;
    }

    /**
     * Converts request query parameters into structured query options.
     *
     * @param req - Express request object containing query parameters
     * @returns Structured {@link QueryOptionTypes} with filters and sorts
     */
    fetchQueryOptions(req: Request): QueryOptionTypes<MovieSchemaFields, MovieQueryMatchFilters> {
        const params = this.optionService.fetchQueryParams(req);
        return this.optionService.generateQueryOptions(params);
    }

    /**
     * Updates the poster image for a specific movie.
     *
     * @param req - Express request object (expects `params._id` and `file`)
     * @param res - Express response object
     * @returns JSON response indicating success
     *
     * @example
     * // POST /movies/123/poster with multipart file
     * // Response: { message: "Poster Image Updated." }
     */
    async updatePosterPicture(req: Request, res: Response): Promise<Response> {
        const { _id } = req.params;
        const movieID = isValidObjectId(_id);
        const image = req.file as Express.Multer.File;

        const movie = await this.imageService.updateMoviePosterImage({ movieID, image });

        return res.status(200).json(movie);
    }

    /**
     * Deletes the poster image of a movie.
     *
     * @param req - Express request object (expects `params._id`)
     * @param res - Express response object
     * @returns JSON response indicating success
     *
     * @example
     * // DELETE /movies/123/poster
     * // Response: { message: "Poster Image Removed." }
     */
    async deletePosterPicture(req: Request, res: Response): Promise<Response> {
        const { _id } = req.params;
        const movieID = isValidObjectId(_id);

        const movie = await this.imageService.deleteMoviePosterImage({ movieID });

        return res.status(200).json(movie);
    }

    /**
     * Fetches a paginated list of movies along with their recent active showings.
     *
     * @param req - Express request object (supports query parameters for pagination, filters, and sort)
     * @param res - Express response object
     * @returns JSON response containing `items` (movies) and `totalItems`
     *
     * @example
     * // GET /movies?page=1&perPage=10&title=Matrix&sortByReleaseDate=-1
     * // Response: { items: [...], totalItems: 50 }
     */
    async fetchPaginatedMoviesWithRecentShowings(req: Request, res: Response): Promise<Response> {
        const { page, perPage } = this.queryUtils.fetchPaginationFromQuery(req);

        const params = this.optionService.fetchQueryParams(req);
        const query = this.optionService.generateMatchFilters(params);
        const sort = this.optionService.generateMatchSorts(params);

        const { items, totalItems } = await this.service.fetchPaginatedMoviesWithRecentShowings({
            page,
            perPage,
            query,
            sort,
        });

        return res.status(200).json({ items, totalItems });
    }

    async test(req: Request, res: Response): Promise<Response> {
        return res.status(200);
    }
}
