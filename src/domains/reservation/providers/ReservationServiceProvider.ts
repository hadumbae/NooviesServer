/**
 * @file ReservationServiceProvider.ts
 *
 * Service provider for the Reservation domain.
 *
 * Acts as the composition root for all reservation-related
 * infrastructure, responsible for constructing and wiring:
 * - The Reservation model
 * - Repository and query services
 * - Aggregation utilities
 * - The Reservation controller
 *
 * Ensures consistent configuration and avoids duplicated
 * setup logic across the application.
 */

import Reservation from "../model/reservation/Reservation.model.js";
import AggregateQueryService from "../../../shared/services/aggregate/AggregateQueryService.js";
import QueryUtils from "../../../shared/services/query-utils/QueryUtils.js";
import type { PopulatePath } from "../../../shared/types/mongoose/PopulatePath.js";
import { BaseRepository } from "../../../shared/repository/BaseRepository.js";
import { ReservationCRUDController } from "../controllers/ReservationCRUDController.js";
import { ReservationQueryOptionService } from "../services/query-options/ReservationQueryOptionService.js";

/**
 * Reservation service provider.
 *
 * @remarks
 * Centralizes dependency construction for the Reservation domain,
 * ensuring that schema hooks, repositories, query services, and
 * controllers are consistently and correctly assembled.
 */
export class ReservationServiceProvider {
    /**
     * Register and assemble Reservation domain services.
     *
     * @remarks
     * This method should be invoked during application bootstrap
     * before routes or controllers are used.
     *
     * @returns Reservation domain bindings including:
     * - The Reservation model
     * - Default populate paths
     * - Constructed controllers
     */
    static register() {
        /** Reservation mongoose model. */
        const model = Reservation;

        /**
         * Default populate paths for reservation queries.
         *
         * @remarks
         * Ensures commonly referenced entities are hydrated
         * consistently across repositories and aggregate queries.
         */
        const populateRefs: PopulatePath[] = [
            "showing",
            "selectedSeating",
        ];

        /** Repository abstraction for reservation persistence. */
        const repository = new BaseRepository({
            model,
            populateRefs,
        });

        /** Query option parsing and transformation service. */
        const optionService = new ReservationQueryOptionService();

        /** Aggregation pipeline service for complex reservation queries. */
        const aggregateService = new AggregateQueryService({
            model,
            populateRefs,
        });

        /** Fully configured Reservation controller. */
        const controller = new ReservationCRUDController({
            repository,
            optionService,
            aggregateService,
            queryUtils: QueryUtils,
        });

        return {
            model,
            populateRefs,
            controllers: {
                controller,
            },
        };
    }
}
