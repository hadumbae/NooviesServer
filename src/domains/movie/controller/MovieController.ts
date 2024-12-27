import BaseController, {type IBaseController, type IBaseControllerConstructor} from "../../../shared/controller/BaseController.js";
import type {IMovie} from "../model/MovieModel.js";

export interface IMovieController extends IBaseController {}
export interface IMovieControllerConstructor extends IBaseControllerConstructor<IMovie> {}

export default class MovieController extends BaseController<IMovie>{
    constructor(params: IMovieControllerConstructor) {
        super({...params});
    }
}