import BaseController, {
    type IBaseController,
    type IBaseControllerConstructor
} from "../../../shared/controller/BaseController.js";
import type IGenre from "../model/IGenre.js";

export interface IGenreController extends IBaseController {}
export interface IGenreControllerConstructor extends IBaseControllerConstructor<IGenre> {}

export default class GenreController extends BaseController<IGenre> implements IGenreController {
    constructor(params: IGenreControllerConstructor) {
        super({...params});
    }
}
