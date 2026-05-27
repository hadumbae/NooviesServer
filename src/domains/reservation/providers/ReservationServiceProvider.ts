/**
 * @fileoverview Composition root for the Reservation domain that centralizes infrastructure wiring.
 *
 * Should be invoked during application bootstrap.
 */

import {Reservation} from "../model/reservation/Reservation.model.js";
import AggregateQueryService from "../../../shared/services/aggregate/AggregateQueryService.js";
import QueryUtils from "../../../shared/services/query-utils/QueryUtils.js";
import type {PopulatePath} from "@shared/types/mongoose/PopulatePath";
import {BaseRepository} from "@shared/repository/BaseRepository";
import {ReservationCRUDController} from "@domains/reservation/features/reservation-crud/controllers/controller";
import {ReservationQueryOptionService} from "@domains/reservation/features/get-query-options/services";
import {ReservationPopulatePaths} from "@domains/reservation/_feat/query-population";

/** Service provider for Reservation domain bindings. */
export class ReservationServiceProvider {
    static register() {
        const model = Reservation;
        const populateRefs: PopulatePath[] = ReservationPopulatePaths;
        const repository = new BaseRepository({model, populateRefs});
        const optionService = new ReservationQueryOptionService();
        const aggregateService = new AggregateQueryService({model});

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
