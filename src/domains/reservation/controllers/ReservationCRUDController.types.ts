/**
 * @file ReservationCRUDController.types.ts
 *
 * Type definitions for the Reservation CRUD controller.
 *
 * Defines constructor contracts and method surfaces
 * for controllers operating on {@link ReservationSchemaFields}.
 */

import type {
    BaseControllerCRUDMethods,
    IBaseCRUDControllerConstructor,
} from "../../../shared/controller/base-crud-controller/BaseControllerCRUDMethods.js";
import type {ReservationSchemaFields} from "../model/reservation/Reservation.types.js";
import type {ReservationQueryOptionService} from "../services/query-options/ReservationQueryOptionService.js";
import type {ReservationQueryMatchFilters} from "../schemas/query/ReservationQueryOption.types.js";

/**
 * Constructor contract for {@link ReservationCRUDController}.
 *
 * Extends the base CRUD controller constructor with
 * a reservation-specific query option service.
 */
export interface ReservationCRUDConstructor
    extends IBaseCRUDControllerConstructor<ReservationSchemaFields> {

    /** Service used to parse and build reservation query options. */
    optionService: ReservationQueryOptionService;
}

/**
 * Method contract for the Reservation CRUD controller.
 *
 * Inherits the standard CRUD method surface while
 * supporting reservation-specific query filtering.
 */
export interface ReservationCRUDMethods
    extends BaseControllerCRUDMethods<
        ReservationSchemaFields,
        ReservationQueryMatchFilters
    > {
}
