/**
 * @file ReservationController.types.ts
 *
 * Type definitions for the Reservation controller.
 *
 * Defines constructor parameters and method contracts
 * for controllers operating on {@link ReservationSchemaFields}.
 */

import type {
    BaseControllerCRUDMethods,
    IBaseCRUDControllerConstructor,
} from "../../../../shared/controller/base-crud-controller/BaseControllerCRUDMethods.js";
import type { ReservationSchemaFields } from "../../model/reservation/Reservation.types.js";
import type { ReservationQueryOptionService } from "../../services/query-options/ReservationQueryOptionService.js";
import type {ReservationQueryMatchFilters} from "../../schemas/query/ReservationQueryOption.types.js";

/**
 * Constructor contract for the Reservation controller.
 *
 * Extends the base CRUD controller constructor with
 * a reservation-specific query option service.
 */
export interface ReservationControllerConstructor
    extends IBaseCRUDControllerConstructor<ReservationSchemaFields> {

    /** Query option service used to parse and build reservation queries. */
    optionService: ReservationQueryOptionService;
}

/**
 * Method contract for the Reservation controller.
 *
 * Inherits the standard CRUD method surface for reservations.
 */
export interface ReservationControllerMethods
    extends BaseControllerCRUDMethods<ReservationSchemaFields, ReservationQueryMatchFilters> {
}
