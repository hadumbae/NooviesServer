import BaseController, {type IBaseController, type IBaseControllerConstructor} from "../../../shared/controller/BaseController.js";
import type {IShowing} from "../model/ShowingInterfaces.js";

export interface IShowingController extends IBaseController {}
export interface IShowingControllerConstructor extends IBaseControllerConstructor<IShowing>{}

export default class ShowingController extends BaseController<IShowing> implements IShowingController {
    constructor(params: IShowingControllerConstructor) {
        super({...params});
    }
}