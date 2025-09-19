import RoleTypeController from "../controllers/RoleTypeController.js";
import RoleTypeModel from "../model/RoleType.model.js";
import RoleTypeQueryOptionService from "../services/RoleTypeQueryOptionService.js";
import AggregateQueryService from "../../../shared/services/aggregate/AggregateQueryService.js";
import RoleTypeRepository from "../repositories/RoleTypeRepository.js";

/**
 * @class RoleTypeServiceProvider
 * @description
 * Service provider responsible for registering and initializing
 * the components related to RoleType: model, repository, services, and controller.
 */
export default class RoleTypeServiceProvider {
    /**
     * Registers the RoleType components and returns an object containing
     * the model, services, and controllers.
     *
     * @static
     * @returns {Object} An object with the following structure:
     * {
     *   model: typeof RoleTypeModel,
     *   repository: BaseRepository,
     *   services: {
     *     optionService: RoleTypeQueryOptionService
     *   },
     *   controllers: {
     *     controller: RoleTypeController
     *   }
     * }
     */
    static register() {
        // Model representing RoleType
        const model = RoleTypeModel;

        // Repository for RoleType with basic CRUD operations
        const repository = new RoleTypeRepository({ model });

        // Service to handle query options for RoleType
        const optionService = new RoleTypeQueryOptionService();

        // Service to handle aggregate queries for RoleType
        const aggregateService = new AggregateQueryService({ model });

        // Controller to handle RoleType-related HTTP requests
        const controller = new RoleTypeController({
            repository,
            optionService,
            aggregateService,
        });

        return {
            model,
            repository,
            services: {
                optionService
            },
            controllers: {
                controller
            },
        };
    }
}
