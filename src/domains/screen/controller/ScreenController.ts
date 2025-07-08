import BaseCRUDController, {
    type IBaseCRUDController,
    type IBaseCRUDControllerConstructor
} from "../../../shared/controller/BaseCRUDController.js";
import type {IScreen} from "../interface/IScreen.js";
import type {Request, Response} from "express";
import ScreenQueryService from "../service/ScreenQueryService.js";
import ScreenService from "../service/ScreenService.js";
import type {FilterQuery} from "mongoose";
import type ScreenSeatService from "../service/screen-seat-service/ScreenSeatService.js";
import isValidObjectId from "../../../shared/utility/query/isValidObjectId.js";

export interface IScreenController extends IBaseCRUDController {
    getScreensByTheatre(req: Request, res: Response): Promise<Response>;
}

export interface IScreenControllerConstructor extends IBaseCRUDControllerConstructor<IScreen> {
    service: ScreenService;
    queryService: ScreenQueryService;
    seatService: ScreenSeatService;
}

export default class ScreenController extends BaseCRUDController<IScreen> implements IScreenController {
    protected service: ScreenService;
    protected queryService: ScreenQueryService;
    protected seatService: ScreenSeatService;

    constructor(params: IScreenControllerConstructor) {
        const {service, queryService, seatService, ...baseParams} = params;
        super({...baseParams});

        this.service = service;
        this.queryService = queryService;
        this.seatService = seatService;
    }

    fetchURLMatchFilters(req: Request): FilterQuery<any> {
        const queryParams = this.queryService.fetchQueryParams(req);
        return this.queryService.generateMatchFilters(queryParams);
    }
    
    async getScreensByTheatre(req: Request, res: Response): Promise<Response> {
        const {_id: theatreID} = req.params;

        const {page, perPage} = this.queryUtils.fetchPaginationFromQuery(req);
        const queryParams = this.queryService.fetchQueryParams(req);
        const {showingsPerScreen} = this.queryService.generateOptions(queryParams);

        const totalItems = await this.repository.count({filters: {theatre: theatreID}});
        const screens = await this.service.fetchPaginatedScreensByTheatre({
            page,
            perPage,
            theatreID,
            showingsPerScreen,
        });

        return res.status(200).json({totalItems, items: screens});
    }

    async getSeatsByRow(req: Request, res: Response): Promise<Response> {
        const {_id} = req.params;
        const screenID = isValidObjectId(_id);

        const {populate} = this.queryUtils.fetchOptionsFromQuery(req);
        const seatsByRow = await this.seatService.fetchSeatsByRow({screenID, populate});

        return res.status(200).json({seatsByRow});
    }
}