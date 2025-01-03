import BaseController, {type IBaseController, type IBaseControllerConstructor} from "../../../shared/controller/BaseController.js";
import type ITheatre from "../model/ITheatre.js";

export interface ITheatreController extends IBaseController{}
export interface ITheatreControllerConstructor extends IBaseControllerConstructor<ITheatre> {}

export default class TheatreController extends BaseController<ITheatre> implements ITheatreController {
    constructor(params: ITheatreControllerConstructor) {
        super({...params});
    }
}