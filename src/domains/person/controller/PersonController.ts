import BaseCRUDController from "../../../shared/controller/base-crud-controller/BaseCRUDController.js";
import type {PersonSchemaFields} from "../model/Person.types";
import type {
    BaseControllerCRUDMethods,
    BaseCRUDControllerConstructorParams
} from "@shared/controller/base-crud-controller/BaseControllerCRUDMethods";

interface IPersonControllerConstructor extends BaseCRUDControllerConstructorParams<PersonSchemaFields> {
}

export interface IPersonController extends BaseControllerCRUDMethods {
}

export default class PersonController extends BaseCRUDController<PersonSchemaFields> implements IPersonController {
    /**
     * Creates a new {@link PersonController}.
     *
     * @param params - Constructor parameters including services and base CRUD options
     */
    constructor(params: IPersonControllerConstructor) {
        super(params);
    }
}
