import BaseCRUDController from "../../../shared/controller/base-crud-controller/BaseCRUDController.js";
import type {IPerson} from "../interfaces/IPerson.js";
import type PersonQueryService from "../services/PersonQueryService.js";
import type {Request, Response} from "express";
import type {FilterQuery} from "mongoose";
import type PersonImageService from "../services/image-service/PersonImageService.js";
import isValidObjectId from "../../../shared/utility/query/isValidObjectId.js";
import type {PersonQueryFilters} from "../schema/query/PersonFilters.types.js";
import type {
    IBaseCRUDController,
    IBaseCRUDControllerConstructor
} from "../../../shared/controller/base-crud-controller/BaseCRUDController.types.js";

interface IPersonControllerConstructor extends IBaseCRUDControllerConstructor<IPerson> {
    queryService: PersonQueryService,
    imageService: PersonImageService,
}

export interface IPersonController extends IBaseCRUDController {
    updateProfileImage(req: Request, res: Response): Promise<Response>;
    deleteProfileImage(req: Request, res: Response): Promise<Response>;
}

export default class PersonController extends BaseCRUDController<IPerson> implements IPersonController {
    protected queryService: PersonQueryService;
    protected imageService: PersonImageService;

    constructor(params: IPersonControllerConstructor) {
        const {queryService, imageService, ...superParams} = params;
        super(superParams);

        this.queryService = queryService;
        this.imageService = imageService;
    }

    fetchURLMatchFilters(req: Request): FilterQuery<PersonQueryFilters> {
        const queryParams = this.queryService.fetchQueryParams(req);
        return this.queryService.generateQueryFilters(queryParams);
    }

    async updateProfileImage(req: Request, res: Response): Promise<Response> {
        const {_id} = req.params;
        const {populate, virtuals} = this.queryUtils.fetchOptionsFromQuery(req);

        const personId = isValidObjectId(_id);
        const profileImage = req.file as Express.Multer.File;

        await this.imageService.updateProfileImage({personId, image: profileImage});
        const person = await this.repository.findById({_id: personId, populate, virtuals});

        return res.status(200).json(person);
    }

    async deleteProfileImage(req: Request, res: Response): Promise<Response> {
        const {_id} = req.params;
        const personId = isValidObjectId(_id);

        await this.imageService.deleteProfileImage({personId});
        return res.status(200).json({message: "Image Removed."});
    }
}