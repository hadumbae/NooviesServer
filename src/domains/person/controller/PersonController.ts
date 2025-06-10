import BaseCRUDController, {
    type IBaseCRUDController,
    type IBaseCRUDControllerConstructor
} from "../../../shared/controller/BaseCRUDController.js";
import type {IPerson} from "../model/IPerson.js";
import type PersonQueryService from "../service/PersonQueryService.js";
import type {Request} from "express";
import type {FilterQuery} from "mongoose";
import type {PersonQueryParams} from "../schema/query/PersonQueryParamsSchema.js";

interface IPersonControllerConstructor extends IBaseCRUDControllerConstructor<IPerson> {
    queryService: PersonQueryService,
}

export interface IPersonController extends IBaseCRUDController {
    queryService: PersonQueryService
}

export default class PersonController extends BaseCRUDController<IPerson> implements IPersonController {
    queryService: PersonQueryService;

    constructor(params: IPersonControllerConstructor) {
        const {queryService, ...superParams} = params;
        super(superParams);

        this.queryService = queryService;
    }

    fetchURLMatchFilters(req: Request): FilterQuery<PersonQueryParams> {
        const queryParams = this.queryService.fetchQueryParams(req);
        return this.queryService.generateMatchFilters(queryParams);
    }
}