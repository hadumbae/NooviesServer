/**
 * @file RoleTypeServiceProvider.ts
 *
 * Registers and wires all RoleType-related components:
 * model, repository, services, and controller.
 */

import RoleTypeController from "../controllers/RoleTypeController.js";
import RoleTypeModel from "../model/RoleType.model.js";
import RoleTypeQueryOptionService from "../services/RoleTypeQueryOptionService.js";
import AggregateQueryService from "../../../shared/services/aggregate/AggregateQueryService.js";
import {BaseRepository} from "../../../shared/repository/BaseRepository.js";
import {RoleTypePersistenceManager} from "../repositories/managers/RoleTypePersistenceManager.js";
import {CRUDWriter} from "../../../shared/repository/operations/CRUDWriter.js";

/**
 * Service provider for RoleType domain.
 *
 * Responsible for composing persistence, query services,
 * and HTTP controller bindings.
 */
export default class RoleTypeServiceProvider {
    /**
     * Registers RoleType dependencies.
     *
     * @returns Registered RoleType components
     */
    static register() {
        /** RoleType mongoose model */
        const model = RoleTypeModel;

        /** Write operations with persistence error handling */
        const writer = new CRUDWriter({
            model,
            persistenceManager: new RoleTypePersistenceManager(),
        });

        /** Repository exposing CRUD + query capabilities */
        const repository = new BaseRepository({model, writer});

        /** Query option parser for filtering, sorting, pagination */
        const optionService = new RoleTypeQueryOptionService();

        /** Aggregate query handler */
        const aggregateService = new AggregateQueryService({model});

        /** HTTP controller */
        const controller = new RoleTypeController({
            repository,
            optionService,
            aggregateService,
        });

        return {
            model,
            repository,
            services: {
                optionService,
            },
            controllers: {
                controller,
            },
        };
    }
}
