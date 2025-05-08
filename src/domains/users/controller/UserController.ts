import type {Request, Response} from "express";
import BaseCRUDController, {
    type IBaseCRUDController,
    type IBaseCRUDControllerConstructor
} from "../../../shared/controller/BaseCRUDController.js";
import type IUser from "../model/IUser.js";
import type UserService from "../service/UserService.js";
import createHttpError from "http-errors";

export interface IUserControllerConstructor extends IBaseCRUDControllerConstructor<IUser> {
    service: UserService;
}

export interface IUserController extends IBaseCRUDController {
    updateUserPassword(req: Request, res: Response): Promise<Response>,
}

export default class UserController extends BaseCRUDController<IUser> implements IUserController {
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