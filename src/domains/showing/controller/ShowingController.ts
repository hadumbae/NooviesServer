import BaseCRUDController from "../../../shared/controller/base-crud-controller/BaseCRUDController.js";
import type IShowing from "../model/IShowing.js";
import type {IShowingQueryService} from "../service/ShowingQueryService.js";
import type {
    IBaseCRUDController,
    IBaseCRUDControllerConstructor
} from "../../../shared/controller/base-crud-controller/BaseCRUDController.types.js";

export interface IShowingController extends IBaseCRUDController {
}

export interface IShowingControllerConstructor extends IBaseCRUDControllerConstructor<IShowing> {
    queryService: IShowingQueryService;
}

export default class ShowingController extends BaseCRUDController<IShowing> implements IShowingController {
    queryService: IShowingQueryService;

    constructor(params: IShowingControllerConstructor) {
        const {queryService, ...superParams} = params;
        super(superParams);
        this.queryService = queryService;
    }
}