import BaseController, {type IBaseController, type IBaseControllerConstructor} from "../../../shared/controller/BaseController.js";
import type {ISeat} from "../model/SeatModel.js";

export interface ISeatController extends IBaseController {}
export interface ISeatControllerConstructor extends IBaseControllerConstructor<ISeat> {}

export default class SeatController extends BaseController<ISeat> implements ISeatController {
    constructor(params: ISeatControllerConstructor) {
        super({...params});
    }
}


