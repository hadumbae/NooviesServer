import BaseController, {type IBaseControllerConstructor} from "../../../shared/controller/BaseController.js";
import type {Request, Response} from "express";
import type MovieURLService from "../service/MovieURLService.js";
import type MovieFavouriteService from "../service/user/MovieFavouriiteService.js";

interface IMovieFavouriteController {
    addToFavourites(req: Request, res: Response): Promise<Response>;

    removeFromFavourites(req: Request, res: Response): Promise<Response>;

    fetchMovieWithFavourites(req: Request, res: Response): Promise<Response>;
}

interface IMovieFavouriteConstructor extends IBaseControllerConstructor {
    urlService: MovieURLService;
    favouriteService: MovieFavouriteService;
}

export default class MovieFavouriteController extends BaseController implements IMovieFavouriteController {
    protected urlService: MovieURLService;
    protected favouriteService: MovieFavouriteService;

    constructor({queryUtils, urlService, favouriteService}: IMovieFavouriteConstructor) {
        super({queryUtils});

        this.urlService = urlService;
        this.favouriteService = favouriteService;
    }

    async addToFavourites(req: Request, res: Response): Promise<Response> {
        const userID = req.authUserID;
        const movieID = this.urlService.getIDParam(req);

        const movie = await this.favouriteService.addMovieToFavourite({movieID, userID: userID!});
        return res.status(200).json({movie, message: "Movie added to user's favourites."});
    }

    async removeFromFavourites(req: Request, res: Response): Promise<Response> {
        const userID = req.authUserID;
        const movieID = this.urlService.getIDParam(req);

        const movie = await this.favouriteService.removeMovieFromFavourite({movieID, userID: userID!});
        return res.status(200).json({movie, message: "Movie removed from user's favourites."});
    }

    async fetchMovieWithFavourites(req: Request, res: Response): Promise<Response> {
        const userID = req.authUserID;
        const movieID = this.urlService.getIDParam(req);

        const {movie, showings} = await this.favouriteService.fetchMovieWithDetails({movieID, userID: userID!});
        return res.status(200).json({movie, showings});
    }
}