import BaseCRUDController, {type IBaseCRUDController, type IBaseCRUDControllerConstructor} from "../../../shared/controller/BaseCRUDController.js";
import type ITheatre from "../model/ITheatre.js";

export interface ITheatreController extends IBaseCRUDController{}
export interface ITheatreControllerConstructor extends IBaseCRUDControllerConstructor<ITheatre> {}

export default class TheatreController extends BaseCRUDController<ITheatre> implements ITheatreController {
    constructor(params: ITheatreControllerConstructor) {
        super({...params});
    }
}