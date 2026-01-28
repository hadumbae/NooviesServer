/**
 * @file ReservationController.types.ts
 *
 * Type definitions for the Reservation controller.
 *
 * Defines the constructor parameters and method surface
 * for controllers operating on {@link ReservationSchemaFields}.
 */

import type {
    BaseControllerCRUDMethods,
    IBaseCRUDControllerConstructor,
} from "../../../../shared/controller/base-crud-controller/BaseControllerCRUDMethods.js";
import type {ReservationSchemaFields} from "../../model/reservation/Reservation.types.js";

/**
 * Constructor contract for the Reservation controller.
 *
 * Extends the base CRUD controller constructor with
 * reservation-specific typing.
 */
export interface ReservationControllerConstructor
    extends IBaseCRUDControllerConstructor<ReservationSchemaFields> {}

/**
 * Method contract for the Reservation controller.
 *
 * Inherits the standard CRUD method set for reservations.
 */
export interface ReservationControllerMethods
    extends BaseControllerCRUDMethods<ReservationSchemaFields> {}
