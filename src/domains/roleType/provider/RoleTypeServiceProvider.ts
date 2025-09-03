import RoleTypeController from "../controllers/RoleTypeController.js";
import BaseRepository from "../../../shared/repository/BaseRepository.js";
import RoleTypeModel from "../model/RoleType.model.js";
import RoleTypeQueryOptionService from "../services/RoleTypeQueryOptionService.js";
import AggregateQueryService from "../../../shared/services/aggregate/AggregateQueryService.js";

/**
 * Service provider for the RoleType domain.
 *
 * Responsible for registering and wiring up:
 * - The {@link RoleTypeModel} (Mongoose schema & model)
 * - A {@link BaseRepository} for data access
 * - Query and aggregation services
 * - The {@link RoleTypeController} for CRUD operations
 *
 * Acts as a factory to encapsulate construction logic and return
 * a fully configured controller with its dependencies.
 */
export default class RoleTypeServiceProvider {
    /**
     * Registers and builds the RoleType module.
     *
     * @returns An object containing:
     * - `optionService`: The {@link RoleTypeQueryOptionService} instance
     * - `controller`: The configured {@link RoleTypeController} instance
     */
    static register() {
        const model = RoleTypeModel;
        const repository = new BaseRepository({ model });

        const optionService = new RoleTypeQueryOptionService();
        const aggregateService = new AggregateQueryService({ model });

        const controller = new RoleTypeController({
            repository,
            optionService,
            aggregateService,
        });

        return {
            optionService,
            controller,
        };
    }
}