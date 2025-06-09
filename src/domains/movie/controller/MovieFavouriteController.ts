import BaseController, {type IBaseControllerConstructor} from "../../../shared/controller/BaseController.js";
import type {Request, Response} from "express";
import type MovieQueryService from "../service/MovieQueryService.js";
import type MovieFavouriteService from "../service/user/MovieFavouriteService.js";

interface IMovieFavouriteController {
    addToFavourites(req: Request, res: Response): Promise<Response>;

    removeFromFavourites(req: Request, res: Response): Promise<Response>;

    fetchFavouriteMovieWithShowings(req: Request, res: Response): Promise<Response>;
}

interface IMovieFavouriteConstructor extends IBaseControllerConstructor {
    queryService: MovieQueryService;
    favouriteService: MovieFavouriteService;
}

export default class MovieFavouriteController extends BaseController implements IMovieFavouriteController {
    protected queryService: MovieQueryService;
    protected favouriteService: MovieFavouriteService;

    constructor({queryUtils, queryService, favouriteService}: IMovieFavouriteConstructor) {
        super({queryUtils});

        this.queryService = queryService;
        this.favouriteService = favouriteService;
    }

    async addToFavourites(req: Request, res: Response): Promise<Response> {
        const userID = req.authUserID;
        const movieID = this.queryService.getIDParam(req);

        const movie = await this.favouriteService.addMovieToFavourite({movieID, userID: userID!});
        console.log("Added!");
        return res.status(200).json(movie);
    }

    async removeFromFavourites(req: Request, res: Response): Promise<Response> {
        const userID = req.authUserID;
        const movieID = this.queryService.getIDParam(req);

        const movie = await this.favouriteService.removeMovieFromFavourite({movieID, userID: userID!});
        console.log("Removed!");
        return res.status(200).json(movie);
    }

    async fetchFavouriteMovieWithShowings(req: Request, res: Response): Promise<Response> {
        const userID = req.authUserID;
        const movieID = this.queryService.getIDParam(req);

        const {movie, showings} = await this.favouriteService.fetchMovieWithDetails({movieID, userID: userID!});
        return res.status(200).json({movie, showings});
    }
}