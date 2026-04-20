/**
 * @file SeatController.ts
 *
 * HTTP controller for Seat resources.
 *
 * Extends the base CRUD controller with Seat-specific
 * query option handling.
 */

import type {Request} from "express";
import BaseCRUDController from "../../../shared/controller/base-crud-controller/BaseCRUDController.js";
import type {SeatSchemaFields} from "../model/Seat.types.js";
import SeatQueryOptionService from "../service/SeatQueryOptionService.js";
import type {
    BaseControllerCRUDMethods,
    BaseCRUDControllerConstructorParams,
} from "@shared/controller/base-crud-controller/BaseControllerCRUDMethods";
import type {QueryOptionTypes} from "@shared/types/query-options/QueryOptionService.types";
import type {SeatQueryMatchFilters} from "@domains/seat/_feat/validate-query";

/**
 * Constructor parameters for {@link SeatController}.
 */
export interface ISeatControllerConstructor
    extends BaseCRUDControllerConstructorParams<SeatSchemaFields> {
    /** Seat-specific query option service. */
    optionService: SeatQueryOptionService;
}

/**
 * Public interface for SeatController.
 */
export interface ISeatController extends BaseControllerCRUDMethods {
}

/**
 * Controller responsible for Seat CRUD operations.
 *
 * Adds Seat-specific query parsing on top of
 * the shared BaseCRUDController behavior.
 */
export default class SeatController
    extends BaseCRUDController<SeatSchemaFields>
    implements ISeatController {
    protected optionService: SeatQueryOptionService;

    constructor(params: ISeatControllerConstructor) {
        const {optionService, ...superParams} = params;
        super(superParams);
        this.optionService = optionService;
    }

    /**
     * Resolves query options for seat listings.
     */
    fetchQueryOptions(
        req: Request,
    ): QueryOptionTypes<SeatSchemaFields, SeatQueryMatchFilters> {
        const params = this.optionService.fetchQueryParams(req);
        return this.optionService.generateQueryOptions(params);
    }
}
