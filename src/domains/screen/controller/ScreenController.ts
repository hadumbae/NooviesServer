import BaseCRUDController, {
    type IBaseCRUDController,
    type IBaseCRUDControllerConstructor
} from "../../../shared/controller/BaseCRUDController.js";
import type {IScreen} from "../interface/IScreen.js";
import type {Request, Response} from "express";
import ScreenQueryService from "../service/ScreenQueryService.js";
import ScreenService from "../service/ScreenService.js";
import type {FilterQuery} from "mongoose";

export interface IScreenController extends IBaseCRUDController {
    getScreensByTheatre(req: Request, res: Response): Promise<Response>;
}

export interface IScreenControllerConstructor extends IBaseCRUDControllerConstructor<IScreen> {
    service: ScreenService;
    queryService: ScreenQueryService;
}

export default class ScreenController extends BaseCRUDController<IScreen> implements IScreenController {
    protected service: ScreenService;
    protected queryService: ScreenQueryService;

    constructor(params: IScreenControllerConstructor) {
        const {service, queryService, ...baseParams} = params;
        super({...baseParams});

        this.service = service;
        this.queryService = queryService;
    }

    fetchURLMatchFilters(req: Request): FilterQuery<any> {
        const queryParams = this.queryService.fetchQueryParams(req);
        return this.queryService.generateMatchFilters(queryParams);
    }

    async all(req: Request, res: Response): Promise<Response> {
        const {populate, virtuals} = this.queryUtils.fetchOptionsFromQuery(req);

        const queryParams = this.queryService.fetchQueryParams(req);
        const filters = this.queryService.generateMatchFilters(queryParams);

        const items = await this.repository.find({filters, populate, virtuals});
        return res.status(200).json(items);
    }

    async paginated(req: Request, res: Response): Promise<Response> {
        const {populate, virtuals} = this.queryUtils.fetchOptionsFromQuery(req);
        const {page, perPage} = this.queryUtils.fetchPaginationFromQuery(req);

        const queryParams = this.queryService.fetchQueryParams(req);
        const filters = this.queryService.generateMatchFilters(queryParams);

        const totalItems = await this.repository.count({filters});
        const items = await this.repository.paginate({page, perPage, filters, populate, virtuals});

        return res.status(200).json({totalItems, items});
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
}