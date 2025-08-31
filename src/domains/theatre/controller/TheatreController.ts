import BaseCRUDController from "../../../shared/controller/base-crud-controller/BaseCRUDController.js";
import type ITheatre from "../model/ITheatre.js";
import type TheatreQueryOptionService from "../services/query/option-service/TheatreQueryOptionService.js";
import type {FilterQuery} from "mongoose";
import type {Request} from "express";
import type {TheatreMatchFilters} from "../schema/query/TheatreQueryOptions.types.js";
import type {
    IBaseCRUDController,
    IBaseCRUDControllerConstructor
} from "../../../shared/controller/base-crud-controller/BaseCRUDController.types.js";

export interface ITheatreController extends IBaseCRUDController {
}

export interface ITheatreControllerConstructor extends IBaseCRUDControllerConstructor<ITheatre> {
    optionService: TheatreQueryOptionService;
}

export default class TheatreController extends BaseCRUDController<ITheatre> implements ITheatreController {
    protected optionService: TheatreQueryOptionService;

    constructor(params: ITheatreControllerConstructor) {
        const {optionService, ...superParams} = params;
        super(superParams);

        this.optionService = optionService;
    }

    fetchURLMatchFilters(req: Request): FilterQuery<TheatreMatchFilters> {
        const queries = this.optionService.fetchQueryParams(req);
        return this.optionService.generateMatchFilters(queries);
    }
}