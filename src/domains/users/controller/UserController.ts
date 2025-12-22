import type {Request, Response} from "express";
import BaseCRUDController from "../../../shared/controller/base-crud-controller/BaseCRUDController.js";
import type UserSchemaFields from "@models/UserSchemaFields.js";
import type UserService from "../service/UserService.js";
import createHttpError from "http-errors";
import type {
    BaseControllerCRUDMethods,
    IBaseCRUDControllerConstructor
} from "../../../shared/controller/base-crud-controller/BaseControllerCRUDMethods.js";

export interface IUserControllerConstructor extends IBaseCRUDControllerConstructor<UserSchemaFields> {
    service: UserService;
}

export interface IUserController extends BaseControllerCRUDMethods {
    updateUserPassword(req: Request, res: Response): Promise<Response>,
}

export default class UserController extends BaseCRUDController<UserSchemaFields> implements IUserController {
    service: UserService;

    constructor(params: IUserControllerConstructor) {
        const {service, ...superParams} = params;
        super(superParams);

        this.service = service;
    }

    async updateUserPassword(req: Request, res: Response): Promise<Response> {
        const {authUserID} = req;

        if (!authUserID) throw createHttpError(401, "Unauthorized!");

        const {_id: userID} = req.params;
        const data = req.body;

        await this.service.updateUserPassword({userID, authUserID, data});

        return res.status(200).json({message: "User Password Updated Successfully."});
    }
}