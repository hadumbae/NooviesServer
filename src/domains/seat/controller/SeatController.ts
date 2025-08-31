import type {Request, Response} from "express";
import BaseCRUDController from "../../../shared/controller/base-crud-controller/BaseCRUDController.js";
import type ISeat from "../model/ISeat.js";
import SeatQueryOptionService from "../service/SeatQueryOptionService.js";
import type {FilterQuery} from "mongoose";
import type SeatQueryService from "../service/query-service/SeatQueryService.js";
import type {
    IBaseCRUDController,
    IBaseCRUDControllerConstructor
} from "../../../shared/controller/base-crud-controller/BaseCRUDController.types.js";

export interface ISeatControllerConstructor extends IBaseCRUDControllerConstructor<ISeat> {
    queryService: SeatQueryService;
    optionService: SeatQueryOptionService;
}

export interface ISeatController extends IBaseCRUDController {
}

export default class SeatController extends BaseCRUDController<ISeat> implements ISeatController {
    protected queryService: SeatQueryService;
    protected optionService: SeatQueryOptionService;

    constructor(params: ISeatControllerConstructor) {
        const {optionService, queryService, ...superParams} = params;
        super(superParams);

        this.optionService = optionService;
        this.queryService = queryService;
    }

    fetchURLMatchFilters(req: Request): FilterQuery<any> {
        const params = this.optionService.fetchQueryParams(req);
        return this.optionService.generateMatchFilters(params);
    }

    async createSeatsByRow(req: Request, res: Response): Promise<Response> {
        const data = req.validatedBody;
        const seats = await this.queryService.createByRow(data);
        return res.status(200).json(seats);
    }
}


