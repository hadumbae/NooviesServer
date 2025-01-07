import BaseController, {
    type IBaseController,
    type IBaseControllerConstructor
} from "../../../shared/controller/BaseController.js";
import type {IScreen} from "../model/IScreen.js";
import type {Request, Response} from "express";
import type {PaginationRequest} from "../../../shared/types/request/CustomRequestTypes.js";
import type {IScreenQueryService} from "../service/ScreenQueryService.js";
import type {IMovieImageService} from "../../movie/service/MovieImageService.js";

export interface IScreenController extends IBaseController {}

export interface IScreenControllerConstructor extends IBaseControllerConstructor<IScreen> {
    queryService: IScreenQueryService;
}

export default class ScreenController extends BaseController<IScreen> implements IScreenController {
    protected queryService: IScreenQueryService;

    constructor(params: IScreenControllerConstructor) {
        const {queryService, ...baseParams} = params;

        super({...baseParams});

        this.queryService = queryService;
    }

    async all(req: Request, res: Response): Promise<Response> {
        const filters = this.queryService.getQuery({req});
        const items = await this.repository.find({filters});
        return res.status(200).json(items);
    }

    async paginated(req: Request, res: Response): Promise<Response> {
        const {page, perPage} = this.paginationUtils.fetchPaginationFromQuery(req);
        const filters = this.queryService.getQuery({req});

        const totalItems = await this.repository.count({filters});
        const items = await this.repository.paginate({page, perPage, filters});

        return res.status(200).json({totalItems, items});
    }
}