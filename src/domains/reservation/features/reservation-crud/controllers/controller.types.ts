/**
 * @fileoverview Type definitions for the Reservation CRUD controller.
 */

import type {
    BaseControllerCRUDMethods,
    BaseCRUDControllerConstructorParams,
} from "@shared/controller/base-crud-controller/BaseControllerCRUDMethods";
import type {ReservationSchemaFields} from "@domains/reservation/model/reservation/Reservation.types";
import {ReservationQueryOptionService} from "@domains/reservation/features/get-query-options/services";

import {
    ReservationQueryMatchFilters
} from "@domains/reservation/_feat/validate-query-options/schemas/ReservationQueryMatchFilterSchema";

/** Constructor contract for the ReservationCRUDController. */
export interface ReservationCRUDConstructor
    extends BaseCRUDControllerConstructorParams<ReservationSchemaFields> {

    optionService: ReservationQueryOptionService;
}

/** Method contract for the Reservation CRUD controller. */
export interface ReservationCRUDMethods
    extends BaseControllerCRUDMethods<
        ReservationSchemaFields,
        ReservationQueryMatchFilters
    > {
}
