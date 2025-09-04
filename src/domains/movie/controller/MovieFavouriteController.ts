import BaseController, {type IBaseControllerConstructor} from "../../../shared/controller/BaseController.js";
import type {Request, Response} from "express";
import type MovieQueryOptionService from "../service/MovieQueryOptionService.js";
import type MovieFavouriteService from "../service/user/MovieFavouriteService.js";
import isValidObjectId from "../../../shared/utility/query/isValidObjectId.js";

interface IMovieFavouriteController {
    addToFavourites(req: Request, res: Response): Promise<Response>;

    removeFromFavourites(req: Request, res: Response): Promise<Response>;

    fetchFavouriteMovieWithShowings(req: Request, res: Response): Promise<Response>;
}

interface IMovieFavouriteConstructor extends IBaseControllerConstructor {
    optionService: MovieQueryOptionService;
    favouriteService: MovieFavouriteService;
}

export default class MovieFavouriteController extends BaseController implements IMovieFavouriteController {
    protected optionService: MovieQueryOptionService;
    protected favouriteService: MovieFavouriteService;

    constructor({optionService, favouriteService, ...superParams}: IMovieFavouriteConstructor) {
        super(superParams);

        this.optionService = optionService;
        this.favouriteService = favouriteService;
    }

    async addToFavourites(req: Request, res: Response): Promise<Response> {
        const {_id} = req.params;

        const userID = req.authUserID;
        const movieID = isValidObjectId(_id);

        const movie = await this.favouriteService.addMovieToFavourite({movieID, userID: userID!});
        return res.status(200).json(movie);
    }

    async removeFromFavourites(req: Request, res: Response): Promise<Response> {
        const {_id} = req.params;

        const userID = req.authUserID;
        const movieID = isValidObjectId(_id);

        const movie = await this.favouriteService.removeMovieFromFavourite({movieID, userID: userID!});
        return res.status(200).json(movie);
    }

    async fetchFavouriteMovieWithShowings(req: Request, res: Response): Promise<Response> {
        const {_id} = req.params;

        const userID = req.authUserID;
        const movieID = isValidObjectId(_id);

        const {movie, showings} = await this.favouriteService.fetchMovieWithDetails({movieID, userID: userID!});
        return res.status(200).json({movie, showings});
    }
}