/**
 * @file ReservationController.ts
 *
 * Controller for managing reservation resources.
 *
 * Provides CRUD operations over {@link ReservationSchemaFields}
 * via the shared base CRUD controller implementation.
 */

import BaseCRUDController from "../../../../shared/controller/base-crud-controller/BaseCRUDController.js";
import type {ReservationSchemaFields} from "../../model/reservation/Reservation.types.js";
import type {
    ReservationControllerConstructor,
    ReservationControllerMethods,
} from "./ReservationController.types.js";

/**
 * Reservation controller.
 *
 * Exposes standard CRUD endpoints for reservations,
 * delegating core behavior to the base CRUD controller.
 */
export class ReservationController
    extends BaseCRUDController<ReservationSchemaFields>
    implements ReservationControllerMethods
{
    constructor(params: ReservationControllerConstructor) {
        super(params);
    }
}
