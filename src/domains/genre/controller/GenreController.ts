import BaseCRUDController, {
    type IBaseCRUDController,
    type IBaseCRUDControllerConstructor
} from "../../../shared/controller/BaseCRUDController.js";
import type IGenre from "../model/Genre.interface.js";
import GenreService from "../service/GenreService.js";
import type {Request, Response} from "express";
import type {ZGenreSubmit} from "../schema/GenreSubmitSchema.js";

export interface IGenreController extends IBaseCRUDController {
}

export interface IGenreControllerConstructor extends IBaseCRUDControllerConstructor<IGenre> {
    genreService: GenreService;
}

export default class GenreController extends BaseCRUDController<IGenre> implements IGenreController {
    genreService: GenreService;

    constructor(params: IGenreControllerConstructor) {
        super({...params});
        this.genreService = params.genreService;
    }

    async update(req: Request, res: Response): Promise<Response> {
        const {_id} = req.params;
        const data = req.validatedBody;
        const item = await this.genreService.updateGenre({genreID: _id, data: data as ZGenreSubmit});

        return res.status(200).json(item);
    }
}
