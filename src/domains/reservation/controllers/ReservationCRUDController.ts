/**
 * @file ReservationCRUDController.ts
 *
 * CRUD controller for reservation resources.
 *
 * Provides standard create, read, update, and delete operations
 * for {@link ReservationSchemaFields}, extending the shared
 * {@link BaseCRUDController} with reservation-specific
 * query option handling.
 */

import BaseCRUDController from "../../../shared/controller/base-crud-controller/BaseCRUDController.js";
import type {ReservationSchemaFields} from "../model/reservation/Reservation.types.js";
import type {
    ReservationCRUDConstructor,
    ReservationCRUDMethods,
} from "./ReservationCRUDController.types.js";
import type {ReservationQueryOptionService} from "../services/query-options/ReservationQueryOptionService.js";
import type {QueryOptionTypes} from "../../../shared/types/query-options/QueryOptionService.types.js";
import type {Request} from "express";
import type {ReservationQueryMatchFilters} from "../schemas/query/ReservationQueryOption.types.js";

/**
 * Reservation CRUD controller.
 *
 * @remarks
 * - Exposes standard CRUD endpoints for reservation documents
 * - Delegates query parsing, validation, and transformation to
 *   {@link ReservationQueryOptionService}
 * - Keeps controller logic thin by relying on shared base behavior
 */
export class ReservationCRUDController
    extends BaseCRUDController<ReservationSchemaFields, ReservationQueryMatchFilters>
    implements ReservationCRUDMethods {

    /** Service responsible for reservation query option resolution. */
    protected optionService: ReservationQueryOptionService;

    /**
     * Create a new {@link ReservationCRUDController}.
     *
     * @param params - Controller dependencies and base configuration
     */
    constructor({optionService, ...superParams}: ReservationCRUDConstructor) {
        super(superParams);
        this.optionService = optionService;
    }

    /**
     * Resolve query options from an incoming HTTP request.
     *
     * @remarks
     * - Parses and validates request query parameters
     * - Converts them into MongoDB-compatible query options
     * - Used internally by base CRUD read handlers
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
