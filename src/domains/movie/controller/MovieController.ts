import BaseController, {type IBaseController, type IBaseControllerConstructor} from "../../../shared/controller/BaseController.js";

import type {Request, Response} from "express";
import type IMovie from "../model/IMovie.js";
import type {IMovieImageService} from "../service/MovieImageService.js";

export interface IMovieControllerConstructor extends IBaseControllerConstructor<IMovie> {
    imageService: IMovieImageService,
}

export interface IMovieController extends IBaseController {
    updatePosterPicture(req: Request, res: Response): Promise<Response>,
}

export default class MovieController extends BaseController<IMovie>{
    private imageService: IMovieImageService;

    constructor(params: IMovieControllerConstructor) {
        const {
            imageService,
            ...constructorParams
        } = params;

        super(constructorParams);
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
}