import BaseController, {
    type IBaseController,
    type IBaseControllerConstructor
} from "../../../shared/controller/BaseController.js";
import type ISeat from "../model/ISeat.js";
import type {ISeatQueryService} from "../service/SeatQueryService.js";
import type {Request, Response} from "express";
import type {SeatQuery} from "../schema/query/SeatQuerySchema.js";


export interface ISeatControllerConstructor extends IBaseControllerConstructor<ISeat> {
    queryService: ISeatQueryService;
}

export interface ISeatController extends IBaseController {}

export default class SeatController extends BaseController<ISeat> implements ISeatController {
    protected queryService: ISeatQueryService;

    constructor(params: ISeatControllerConstructor) {
        const {queryService, ...superParams} = params;
        super(superParams);

        this.queryService = queryService;
    }

    async all(req: Request, res: Response): Promise<Response> {
        const filters = this.queryService.getMatchFilters({req}) as SeatQuery;
        const items = await this.repository.find({filters});

        return res.status(200).json(items);
    }

    async paginated(req: Request, res: Response): Promise<Response> {
        const {page, perPage} = this.queryUtils.fetchPaginationFromQuery(req);
        const filters = this.queryService.getMatchFilters({req});

        const totalItems = await this.repository.count();
        const items = await this.repository.paginate({filters, page, perPage});

        return res.status(200).json({totalItems, items});
    }
}


