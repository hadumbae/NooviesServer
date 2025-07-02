import BaseCRUDController, {
    type IBaseCRUDController,
    type IBaseCRUDControllerConstructor
} from "../../../shared/controller/BaseCRUDController.js";
import type ISeat from "../model/ISeat.js";
import type {ISeatQueryService} from "../service/SeatQueryService.js";


export interface ISeatControllerConstructor extends IBaseCRUDControllerConstructor<ISeat> {
    queryService: ISeatQueryService;
}

export interface ISeatController extends IBaseCRUDController {}

export default class SeatController extends BaseCRUDController<ISeat> implements ISeatController {
    protected queryService: ISeatQueryService;

    constructor(params: ISeatControllerConstructor) {
        const {queryService, ...superParams} = params;
        super(superParams);

        this.queryService = queryService;
    }
}


