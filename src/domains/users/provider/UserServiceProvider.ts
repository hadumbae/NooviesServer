import User from "../model/User.js";
import type IUser from "../model/IUser.js";

import UserController from "../controller/UserController.js";

import BaseRepository from "../../../shared/repository/BaseRepository.js";
import QueryUtils from "../../../shared/utility/query/QueryUtils.js";

export default class UserServiceProvider {
    static register() {
        const model = User;
        const populateRefs: string[] = [];

        const repository = new BaseRepository<IUser>({model, populateRefs});
        const queryUtils = QueryUtils;

        const controller = new UserController({repository, queryUtils});

        return {
            repository,
            controller,
        };
    }
}