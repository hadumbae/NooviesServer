/**
 * @file SeatMapServiceProvider.ts
 *
 * Registers and composes all SeatMap domain components.
 */

import SeatMap from "../model/SeatMap.model.js";
import SeatMapController from "../controller/SeatMapController.js";
import SeatMapService from "../service/seat-map-service/SeatMapService.js";
import QueryUtils from "../../../shared/services/query-utils/QueryUtils.js";
import SeatMapQueryOptionService from "../service/query-option/SeatMapQueryOptionService.js";
import AggregateQueryService from "../../../shared/services/aggregate/AggregateQueryService.js";
import SeatMapPopulateRefs from "../constants/SeatMapPopulateRefs.js";
import {BaseRepository} from "../../../shared/repository/BaseRepository.js";
import {CRUDWriter} from "../../../shared/repository/operations/CRUDWriter.js";
import {SeatMapPersistenceManager} from "../repositories/managers/SeatMapPersistenceManager.js";

/**
 * Service provider for SeatMap.
 *
 * Wires persistence, query services, business logic,
 * and HTTP controllers for the SeatMap domain.
 */
export default class SeatMapServiceProvider {
    /**
     * Registers SeatMap dependencies.
     *
     * @returns Registered SeatMap components
     */
    static register() {
        /** SeatMap mongoose model */
        const model = SeatMap;

        /** Mongoose population configuration */
        const populateRefs = SeatMapPopulateRefs;

        /** Shared query utilities */
        const queryUtils = QueryUtils;

        /** Write layer with persistence error handling */
        const writer = new CRUDWriter({
            model,
            populateRefs,
            persistenceManager: new SeatMapPersistenceManager(),
        });

        /** Repository exposing CRUD and query operations */
        const repository = new BaseRepository({
            model,
            populateRefs,
            writer,
        });

        /** Domain business logic */
        const service = new SeatMapService();

        /** Query option parser */
        const queryService = new SeatMapQueryOptionService();

        /** Aggregate query handler */
        const aggregateService = new AggregateQueryService({
            model,
            populateRefs,
        });

        /** HTTP controller */
        const controller = new SeatMapController({
            repository,
            service,
            queryService,
            queryUtils,
            aggregateService,
        });

        return {
            model,
            repository,
            services: {
                service,
                queryService,
                aggregateService,
            },
            controllers: {
                controller,
            },
        };
    }
}
