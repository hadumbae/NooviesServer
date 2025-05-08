import BaseCRUDController, {
    type IBaseCRUDController,
    type IBaseCRUDControllerConstructor
} from "../../../shared/controller/BaseCRUDController.js";
import type {IPerson} from "../model/IPerson.js";


interface IPersonControllerConstructor extends IBaseCRUDControllerConstructor<IPerson> {}
export interface IPersonController extends IBaseCRUDController {}

export default class PersonController extends BaseCRUDController<IPerson> implements IPersonController {
    constructor(params: IPersonControllerConstructor) {
        super({ ...params });
    }
}