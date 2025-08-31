import BaseCRUDController from "../../../shared/controller/base-crud-controller/BaseCRUDController.js";
import type IShowing from "../model/IShowing.js";
import type {Request, Response} from "express";
import type {IShowingSeatingService} from "../service/ShowingSeatingService.js";
import type {IShowingQueryService} from "../service/ShowingQueryService.js";
import type {ShowingSeatQuery} from "../schema/query/ShowingSeatQuerySchema.js";
import type {
    IBaseCRUDController,
    IBaseCRUDControllerConstructor
} from "../../../shared/controller/base-crud-controller/BaseCRUDController.types.js";

export interface IShowingController extends IBaseCRUDController {
}

export interface IShowingControllerConstructor extends IBaseCRUDControllerConstructor<IShowing> {
    queryService: IShowingQueryService;
    seatService: IShowingSeatingService;
}

export default class ShowingController extends BaseCRUDController<IShowing> implements IShowingController {
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