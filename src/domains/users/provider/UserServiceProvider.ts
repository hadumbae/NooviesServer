import User from "../model/User.js";
import type IUser from "../model/IUser.js";

import UserController from "../controller/UserController.js";

import BaseRepository from "../../../shared/repository/BaseRepository.js";
import QueryUtils from "../../../shared/services/query-utils/QueryUtils.js";
import UserService from "../service/UserService.js";
import AggregateQueryService from "../../../shared/services/aggregate/AggregateQueryService.js";

export default class UserServiceProvider {
    static register() {
        const model = User;
        const populateRefs: string[] = [];

        const repository = new BaseRepository<IUser>({model, populateRefs});
        const queryUtils = QueryUtils;
        const service = new UserService();
        const aggregateService = new AggregateQueryService({model, populateRefs});

        const controller = new UserController({repository, queryUtils, service, aggregateService});

        return {
            repository,
            controller,
        };
    }
}