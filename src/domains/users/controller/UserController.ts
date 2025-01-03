import BaseController, {type IBaseController, type IBaseControllerConstructor} from "../../../shared/controller/BaseController.js";
import type IUser from "../model/IUser.js";

export interface IUserControllerConstructor extends IBaseControllerConstructor<IUser>{}

export interface IUserController extends IBaseController{}

export default class UserController extends BaseController<IUser> implements IUserController {
    constructor(params: IUserControllerConstructor) {
        super({...params});
    }
}