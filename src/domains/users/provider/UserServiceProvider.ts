import User from "../model/User.js";
import type UserSchemaFields from "@models/UserSchemaFields.js";

import UserController from "../controller/UserController.js";

import BaseRepository from "../../../shared/repository/BaseRepository.js";
import QueryUtils from "../../../shared/services/query-utils/QueryUtils.js";
import UserService from "../service/user-service/UserService.js";
import AggregateQueryService from "../../../shared/services/aggregate/AggregateQueryService.js";

/**
 * Service provider for the user module.
 *
 * Handles the creation and registration of all user-related services,
 * repositories, and controllers.
 *
 * @example
 * ```ts
 * const { repository, controller } = UserServiceProvider.register();
 *
 * // Use repository for data operations
 * const users = await repository.all();
 *
 * // Use controller for handling API requests
 * await controller.get(req, res);
 * ```
 */
export default class UserServiceProvider {
    /**
     * Registers and returns all user module dependencies.
     *
     * Initializes the model, repository, query utilities, service, aggregate service,
     * and controller, and returns them as an object.
     *
     * @returns An object containing:
     *  - `repository`: The BaseRepository instance for user data access.
     *  - `controller`: The UserController instance for handling user requests.
     */
    static register() {
        const model = User;
        const populateRefs: string[] = [];

        const repository = new BaseRepository<UserSchemaFields>({ model, populateRefs });
        const queryUtils = QueryUtils;
        const service = new UserService();
        const aggregateService = new AggregateQueryService({ model, populateRefs });

        const controller = new UserController({ repository, queryUtils, service, aggregateService });

        return {
            repository,
            controller,
        };
    }
}
