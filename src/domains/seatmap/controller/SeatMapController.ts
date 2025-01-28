import type {Request, Response} from "express";

import BaseController, {
    type IBaseController,
    type IBaseControllerConstructor
} from "../../../shared/controller/BaseController.js";

import type ISeatMap from "../model/ISeatMap.js";
import type {ISeatMapQueryService} from "../service/SeatMapQueryService.js";
import type ISeatMapService from "../service/ISeatMapService.js";

export interface ISeatMapControllerConstructor extends IBaseControllerConstructor<ISeatMap> {
    service: ISeatMapService;
    queryService: ISeatMapQueryService;
}

export interface ISeatMapController extends IBaseController {
    createSeatMap(req: Request, res: Response): Promise<Response>;
    getShowingSeatMap(req: Request, res: Response): Promise<Response>;
    toggleSeatMapAvailability(req: Request, res: Response): Promise<Response>;
}

export default class SeatMapController extends BaseController<ISeatMap> implements ISeatMapController {
    protected service: ISeatMapService;
    protected queryService: ISeatMapQueryService;

    constructor(params: ISeatMapControllerConstructor) {
        const {service, queryService, ...superParams} = params;
        super(superParams);

        this.service = service;
        this.queryService = queryService;
    }

    async createSeatMap(req: Request, res: Response): Promise<Response> {
        const {_id: showingID} = req.params;
        await this.service.createShowingSeatMap({showingID});
        return res.status(200).json({message: "Seat Map created."});
    }

    async getShowingSeatMap(req: Request, res: Response): Promise<Response> {
        const {_id: showingID} = req.params;
        const {page, perPage} = this.queryUtils.fetchPaginationFromQuery(req);

        const data = await this.service.getShowingSeatMap({showingID, page, perPage});
        return res.status(200).json(data);
    }

    async toggleSeatMapAvailability(req: Request, res: Response): Promise<Response> {
        const {_id: seatMapID} = req.params;
        const data = await this.service.toggleSeatMapAvailability({seatMapID});
        console.log(data);
        return res.status(200).json(data);
    }
}