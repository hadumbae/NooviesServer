import BaseController, {
    type IBaseController,
    type IBaseControllerConstructor
} from "../../../shared/controller/BaseController.js";
import type IShowing from "../model/IShowing.js";
import type {Request, Response} from "express";
import type {IShowingSeatingService} from "../service/ShowingSeatingService.js";
import type {IShowingQueryService} from "../service/ShowingQueryService.js";
import type {ShowingSeatQuery} from "../schema/query/ShowingSeatQuerySchema.js";

export interface IShowingController extends IBaseController {
}

export interface IShowingControllerConstructor extends IBaseControllerConstructor<IShowing> {
    queryService: IShowingQueryService;
    seatService: IShowingSeatingService;
}

export default class ShowingController extends BaseController<IShowing> implements IShowingController {
    queryService: IShowingQueryService;
    seatService: IShowingSeatingService;

    constructor(params: IShowingControllerConstructor) {
        const {queryService, seatService, ...superParams} = params;

        super(superParams);

        this.queryService = queryService;
        this.seatService = seatService;
    }

    async fetchSeatsForShowing(req: Request, res: Response): Promise<Response> {
        const {_id: showingID} = req.params;
        const {populate, mapped} = this.queryService.getShowingSeatsQuery({req}) as ShowingSeatQuery;

        const seats = await this.seatService.fetchSeatsForShowing({showingID, populate, mapped});
        return res.status(200).json(seats);
    }
}