import User from "../model/User.js";
import type IUser from "../model/IUser.js";

import UserController from "../controller/UserController.js";

import BaseRepository from "../../../shared/repository/BaseRepository.js";
import QueryUtils from "../../../shared/utility/query/QueryUtils.js";
import UserService from "../service/UserService.js";

export default class UserServiceProvider {
    static register() {
        const model = User;
        const populateRefs: string[] = [];

        const repository = new BaseRepository<IUser>({model, populateRefs});
        const queryUtils = QueryUtils;
        const service = new UserService();

        const controller = new UserController({repository, queryUtils, service});

        return {
            repository,
            controller,
        };
    }
}