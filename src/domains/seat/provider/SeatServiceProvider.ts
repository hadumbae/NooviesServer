/**
 * @file SeatServiceProvider.ts
 *
 * Dependency registration for the Seat domain.
 */

import SeatController from "../controller/SeatController.js";
import SeatQueryOptionService from "../service/SeatQueryOptionService.js";
import QueryUtils from "../../../shared/services/query-utils/QueryUtils.js";
import AggregateQueryService from "../../../shared/services/aggregate/AggregateQueryService.js";
import Seat from "../model/Seat.model.js";
import {SeatPersistenceManager} from "../repositories/managers/SeatPersistenceManager.js";
import {BaseRepository} from "../../../shared/repository/BaseRepository.js";

/**
 * Service provider for Seat-related infrastructure.
 *
 * Wires together model, repository, services,
 * and controller for the Seat domain.
 */
export default class SeatServiceProvider {
    /**
     * Registers Seat dependencies.
     */
    static register() {
        const model = Seat;
        const populateRefs = ["theatre", "screen"];
        const queryUtils = QueryUtils;

        const persistenceManager = new SeatPersistenceManager();

        const repository = new BaseRepository({
            model,
            populateRefs,
            persistenceManager,
        });

        const optionService = new SeatQueryOptionService();
        const aggregateService = new AggregateQueryService({model, populateRefs});

        const controller = new SeatController({
            repository,
            queryUtils,
            optionService,
            aggregateService,
        });

        return {
            model,
            repository,
            services: {
                optionService,
                aggregateService,
            },
            controllers: {
                controller,
            },
        };
    }
}
