import type {Request} from "express";
import BaseCRUDController, {
    type IBaseCRUDController,
    type IBaseCRUDControllerConstructor
} from "../../../shared/controller/BaseCRUDController.js";
import type ISeat from "../model/ISeat.js";
import SeatQueryOptionService from "../service/SeatQueryOptionService.js";
import type {FilterQuery} from "mongoose";

export interface ISeatControllerConstructor extends IBaseCRUDControllerConstructor<ISeat> {
    optionService: SeatQueryOptionService;
}

export interface ISeatController extends IBaseCRUDController {}

export default class SeatController extends BaseCRUDController<ISeat> implements ISeatController {
    protected optionService: SeatQueryOptionService;

    constructor(params: ISeatControllerConstructor) {
        const {optionService, ...superParams} = params;
        super(superParams);

        this.optionService = optionService;
    }

    fetchURLMatchFilters(req: Request): FilterQuery<any> {
        const params = this.optionService.fetchQueryParams(req);
        return this.optionService.generateMatchFilters(params);
    }
}


