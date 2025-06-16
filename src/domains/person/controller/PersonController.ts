import BaseCRUDController, {
    type IBaseCRUDController,
    type IBaseCRUDControllerConstructor
} from "../../../shared/controller/BaseCRUDController.js";
import type {IPerson} from "../model/IPerson.js";
import type PersonQueryService from "../services/PersonQueryService.js";
import type {Request, Response} from "express";
import type {FilterQuery} from "mongoose";
import type {PersonQueryParams} from "../schema/query/PersonQueryParamsSchema.js";
import type PersonImageService from "../services/image-service/PersonImageService.js";
import isValidObjectId from "../../../shared/utility/query/isValidObjectId.js";

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

    fetchURLMatchFilters(req: Request): FilterQuery<PersonQueryParams> {
        const queryParams = this.queryService.fetchQueryParams(req);
        return this.queryService.generateMatchFilters(queryParams);
    }

    async updateProfileImage(req: Request, res: Response): Promise<Response> {
        const {_id} = req.params;
        const {populate, virtuals} = this.queryUtils.fetchOptionsFromQuery(req);

        const personID = isValidObjectId(_id);
        const profileImage = req.file as Express.Multer.File;

        await this.imageService.updateProfileImage({personID, image: profileImage});
        const person = await this.repository.findById({_id: personID, populate, virtuals});

        return res.status(200).json({message: "Image Updated.", data: person});
    }

    async deleteProfileImage(req: Request, res: Response): Promise<Response> {
        const {_id} = req.params;
        const personID = isValidObjectId(_id);

        await this.imageService.deleteProfileImage({personID});
        return res.status(200).json({message: "Image Removed."});
    }
}