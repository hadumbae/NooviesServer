import BaseController, {
    type IBaseController,
    type IBaseControllerConstructor
} from "../../../shared/controller/BaseController.js";
import type {IScreen} from "../model/IScreen.js";

export interface IScreenController extends IBaseController {}

export interface IScreenControllerConstructor extends IBaseControllerConstructor<IScreen> {}

export default class ScreenController extends BaseController<IScreen> implements IScreenController {
    constructor(params: IScreenControllerConstructor) {
        super({...params});
    }
}