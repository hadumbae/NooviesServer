/**
 * @file SeatMapServiceProvider.ts
 *
 * Composes and registers all SeatMap domain dependencies.
 *
 * Responsibilities:
 * - Model and repository wiring
 * - Query and aggregation services
 * - Domain service instantiation
 * - HTTP controller construction
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
 * Service provider for the SeatMap domain.
 *
 * Centralizes dependency composition for repositories,
 * services, query utilities, and controllers.
 */
export default class SeatMapServiceProvider {
    /**
     * Registers and wires SeatMap components.
     *
     * @returns Fully constructed SeatMap domain objects
     */
    static register() {
        /** SeatMap mongoose model */
        const model = SeatMap;

        /** Population paths for SeatMap queries */
        const populateRefs = SeatMapPopulateRefs;

        /** Shared query utility helpers */
        const queryUtils = QueryUtils;

        /** Write-layer abstraction with persistence handling */
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

        /** SeatMap domain business logic */
        const service = new SeatMapService();

        /** Query option parsing and validation */
        const optionService = new SeatMapQueryOptionService();

        /** Aggregate query execution service */
        const aggregateService = new AggregateQueryService({
            model,
            populateRefs,
        });

        /** HTTP controller for SeatMap endpoints */
        const controller = new SeatMapController({
            repository,
            service,
            optionService,
            queryUtils,
            aggregateService,
        });

        return {
            model,
            repository,
            services: {
                service,
                optionService,
                aggregateService,
            },
            controllers: {
                controller,
            },
        };
    }
}
