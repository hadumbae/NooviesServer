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
    BaseCRUDControllerConstructorParams,
} from "@shared/controller/base-crud-controller/BaseControllerCRUDMethods";
import type {ReservationSchemaFields} from "@domains/reservation/model/reservation/Reservation.types";
import {ReservationQueryOptionService} from "@domains/reservation/features/get-query-options/services";
import type {ReservationQueryMatchFilters} from "@domains/reservation/features/get-query-options/schemas";

/**
 * Constructor contract for {@link ReservationCRUDController}.
 *
 * Extends the base CRUD controller constructor with
 * a reservation-specific query option service.
 */
export interface ReservationCRUDConstructor
    extends BaseCRUDControllerConstructorParams<ReservationSchemaFields> {

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
