/**
 * @fileoverview Controller for handling CRUD operations and query option generation for reservations.
 */

import BaseCRUDController from "@shared/controller/base-crud-controller/BaseCRUDController";
import type {ReservationSchemaFields} from "@domains/reservation/model/reservation";
import type {
    ReservationCRUDConstructor,
    ReservationCRUDMethods,
} from "./controller.types";
import type {Request} from "express";
import type {ReservationQueryMatchFilters} from "@domains/reservation/features/get-query-options/schemas";
import {ReservationQueryOptionService} from "@domains/reservation/features/get-query-options/services";
import type {QueryOptionTypes} from "@shared/types/query-options/QueryOptionService.types";

/**
 * Controller providing standard CRUD endpoints and specialized query parsing for reservation entities.
 */
export class ReservationCRUDController
    extends BaseCRUDController<ReservationSchemaFields, ReservationQueryMatchFilters>
    implements ReservationCRUDMethods {

    protected optionService: ReservationQueryOptionService;

    constructor({optionService, ...superParams}: ReservationCRUDConstructor) {
        super(superParams);
        this.optionService = optionService;
    }

    fetchQueryOptions(
        req: Request,
    ): QueryOptionTypes<ReservationSchemaFields, ReservationQueryMatchFilters> {
        const options = this.optionService.fetchQueryParams(req);
        return this.optionService.generateQueryOptions(options);
    }
}
