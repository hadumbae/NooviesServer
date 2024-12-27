import type {IPerson} from "../model/PersonModel.js";
import BaseController, {
    type IBaseController,
    type IBaseControllerConstructor
} from "../../../shared/controller/BaseController.js";


interface IPersonControllerConstructor extends IBaseControllerConstructor<IPerson> {}
export interface IPersonController extends IBaseController {}

export default class PersonController extends BaseController<IPerson> implements IPersonController {
    constructor(params: IPersonControllerConstructor) {
        super({ ...params });
    }
}