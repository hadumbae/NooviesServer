import BaseCRUDController, {
    type IBaseCRUDController,
    type IBaseCRUDControllerConstructor
} from "../../../shared/controller/BaseCRUDController.js";
import type {IScreen} from "../interface/IScreen.js";
import type {Request, Response} from "express";
import type {IScreenQueryService} from "../service/ScreenQueryService.js";
import type {IScreenService} from "../service/ScreenService.js";

export interface IScreenController extends IBaseCRUDController {
    getScreensByTheatre(req: Request, res: Response): Promise<Response>;
}

export interface IScreenControllerConstructor extends IBaseCRUDControllerConstructor<IScreen> {
    service: IScreenService;
    queryService: IScreenQueryService;
}

export default class ScreenController extends BaseCRUDController<IScreen> implements IScreenController {
    protected service: IScreenService;
    protected queryService: IScreenQueryService;

    constructor(params: IScreenControllerConstructor) {
        const {service, queryService, ...baseParams} = params;
        super({...baseParams});

        this.service = service;
        this.queryService = queryService;
    }

    async all(req: Request, res: Response): Promise<Response> {
        const {populate, virtuals} = this.queryUtils.fetchOptionsFromQuery(req);
        const filters = this.queryService.fetchQuery(req);

        const items = await this.repository.find({filters, populate, virtuals});
        return res.status(200).json(items);
    }

    async paginated(req: Request, res: Response): Promise<Response> {
        const {populate, virtuals} = this.queryUtils.fetchOptionsFromQuery(req);
        const {page, perPage} = this.queryUtils.fetchPaginationFromQuery(req);
        const filters = this.queryService.fetchQuery(req);

        const totalItems = await this.repository.count({filters});
        const items = await this.repository.paginate({page, perPage, filters, populate, virtuals});

        return res.status(200).json({totalItems, items});
    }

    async getScreensByTheatre(req: Request, res: Response): Promise<Response> {
        const {_id: theatreID} = req.params;

        const {page, perPage} = this.queryUtils.fetchPaginationFromQuery(req);
        const {showingsPerScreen} = this.queryService.fetchShowingQuery(req);

        const totalItems = await this.repository.count({filters: {theatre: theatreID}});
        const screens = await this.service.fetchPaginatedScreensByTheatre({
            page,
            perPage,
            theatreID,
            showingsPerScreen,
        });

        return res.status(200).json({totalItems, items: screens});
    }
}