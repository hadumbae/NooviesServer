import BaseCRUDController, {
    type IBaseCRUDController,
    type IBaseCRUDControllerConstructor
} from "../../../shared/controller/BaseCRUDController.js";
import type {IPerson} from "../model/IPerson.js";
import type PersonQueryService from "../service/PersonQueryService.js";
import type {Request, Response} from "express";

interface IPersonControllerConstructor extends IBaseCRUDControllerConstructor<IPerson> {
    queryService: PersonQueryService,
}

export interface IPersonController extends IBaseCRUDController {
    queryService: PersonQueryService
}

export default class PersonController extends BaseCRUDController<IPerson> implements IPersonController {
    queryService: PersonQueryService;

    constructor(params: IPersonControllerConstructor) {
        const {queryService, ...superParams} = params;
        super(superParams);

        this.queryService = queryService;
    }

    async all(req: Request, res: Response): Promise<Response> {
        const {populate, virtuals, limit} = this.queryUtils.fetchOptionsFromQuery(req);

        const queries = this.queryService.fetchQueryParams(req);
        const filters = this.queryService.generateMatchFilters(queries);

        const items = await this.repository.find({populate, virtuals, limit, filters});
        return res.status(200).json(items);
    }

    async paginated(req: Request, res: Response): Promise<Response> {
        const {populate, virtuals} = this.queryUtils.fetchOptionsFromQuery(req);
        const {page, perPage} = this.queryUtils.fetchPaginationFromQuery(req);

        const queries = this.queryService.fetchQueryParams(req);
        const filters = this.queryService.generateMatchFilters(queries);

        const totalItems = await this.repository.count({filters});
        const items = await this.repository.paginate({page, perPage, populate, virtuals, filters});

        return res.status(200).json({totalItems, items});
    }
}