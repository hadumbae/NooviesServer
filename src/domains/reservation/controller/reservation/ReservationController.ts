/**
 * @file ReservationController.ts
 *
 * Controller for managing reservation resources.
 *
 * Provides CRUD operations for {@link ReservationSchemaFields},
 * extending the shared base CRUD controller with
 * reservation-specific query option handling.
 */

import BaseCRUDController from "../../../../shared/controller/base-crud-controller/BaseCRUDController.js";
import type {ReservationSchemaFields} from "../../model/reservation/Reservation.types.js";
import type {
    ReservationControllerConstructor,
    ReservationControllerMethods,
} from "./ReservationController.types.js";
import type {ReservationQueryOptionService} from "../../services/query-options/ReservationQueryOptionService.js";
import type {QueryOptionTypes} from "../../../../shared/types/query-options/QueryOptionService.types.js";
import type {Request} from "express";
import type {ReservationQueryMatchFilters} from "../../schemas/query/ReservationQueryOption.types.js";

/**
 * Reservation controller.
 *
 * Exposes standard CRUD endpoints for reservations while
 * delegating query parsing and transformation to the
 * {@link ReservationQueryOptionService}.
 */
export class ReservationController
    extends BaseCRUDController<ReservationSchemaFields, ReservationQueryMatchFilters>
    implements ReservationControllerMethods {

    /** Service responsible for query option parsing and generation. */
    protected optionService: ReservationQueryOptionService;

    /**
     * Create a new Reservation controller.
     *
     * @param params - Controller constructor parameters
     */
    constructor({optionService, ...superParams}: ReservationControllerConstructor) {
        super(superParams);
        this.optionService = optionService;
    }

    /**
     * Resolve query options from an incoming request.
     *
     * Parses, validates, and converts request query parameters
     * into MongoDB-compatible query options.
     *
     * @param req - Express request object
     * @returns Structured query options for reservation queries
     */
    fetchQueryOptions(
        req: Request,
    ): QueryOptionTypes<ReservationSchemaFields, ReservationQueryMatchFilters> {
        const options = this.optionService.fetchQueryParams(req);
        return this.optionService.generateQueryOptions(options);
    }
}
