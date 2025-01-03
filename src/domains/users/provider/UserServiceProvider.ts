import User from "../model/User.js";
import BaseRepository from "../../../shared/repository/BaseRepository.js";
import type {Model} from "mongoose";
import type IUser from "../model/IUser.js";
import PaginationUtils from "../../../shared/utility/PaginationUtils.js";
import UserController from "../controller/UserController.js";

export default class UserServiceProvider {
    static register() {
        const model: Model<IUser> = User;
        const populateRefs: string[] = [];

        const repository = new BaseRepository({model, populateRefs});
        const paginationUtils = PaginationUtils;

        const controller = new UserController({repository, paginationUtils});

        return {
            repository,
            controller,
        };
    }
}