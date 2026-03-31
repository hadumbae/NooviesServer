/**
 * @file ReservationServiceProvider.ts
 *
 * Composition root for the Reservation domain.
 *
 * Responsibilities:
 * - Provide the Reservation model
 * - Construct repository abstraction
 * - Configure query option service
 * - Configure aggregation service
 * - Wire and expose controllers
 *
 * @remarks
 * This provider centralizes all Reservation domain wiring.
 * It prevents duplicated construction logic across routes
 * and guarantees consistent configuration.
 *
 * Should be invoked during application bootstrap.
 */

import Reservation from "../model/reservation/Reservation.model.js";
import AggregateQueryService from "../../../shared/services/aggregate/AggregateQueryService.js";
import QueryUtils from "../../../shared/services/query-utils/QueryUtils.js";
import type { PopulatePath } from "@shared/types/mongoose/PopulatePath";
import { BaseRepository } from "@shared/repository/BaseRepository";
import { ReservationCRUDController } from "@domains/reservation/features/reservation-crud/controllers/controller";
import { ReservationQueryOptionService } from "domains/reservation/features/get-query-options/services";
import {ReservationPopulateRefs} from "@domains/reservation/constants";

/**
 * Service provider for Reservation domain bindings.
 */
export class ReservationServiceProvider {

    /**
     * Assemble Reservation domain infrastructure.
     *
     * @returns Domain bindings:
     * - model
     * - default populate refs
     * - controllers
     */
    static register() {
        /**
         * Reservation mongoose model.
         */
        const model = Reservation;

        /**
         * Default populate configuration.
         *
         * Ensures consistent hydration of related entities
         * across repositories and aggregate queries.
         */
        const populateRefs: PopulatePath[] = ReservationPopulateRefs;

        /**
         * Persistence abstraction layer.
         */
        const repository = new BaseRepository({
            model,
            populateRefs,
        });

        /**
         * Query parameter parsing and transformation.
         */
        const optionService = new ReservationQueryOptionService();

        /**
         * Aggregation pipeline service.
         */
        const aggregateService = new AggregateQueryService({
            model,
        });

        /**
         * Fully composed CRUD controller.
         */
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
