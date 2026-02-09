/**
 * @file SeatMapController.types.ts
 *
 * Type definitions for the SeatMap HTTP controller.
 *
 * Declares constructor dependencies and the public
 * controller method contract for SeatMap endpoints.
 */

import type {
    BaseControllerCRUDMethods,
    IBaseCRUDControllerConstructor
} from "../../../shared/controller/base-crud-controller/BaseControllerCRUDMethods.js";
import type {SeatMapSchemaFields} from "../model/SeatMap.types.js";
import type SeatMapService from "../service/seat-map-service/SeatMapService.js";
import SeatMapQueryOptionService from "../service/query-option/SeatMapQueryOptionService.js";
import type {Request, Response} from "express";

/**
 * Constructor parameters for {@link SeatMapController}.
 */
export interface ISeatMapControllerConstructor
    extends IBaseCRUDControllerConstructor<SeatMapSchemaFields> {

    /** SeatMap domain business logic service */
    service: SeatMapService;

    /** Service responsible for parsing and generating query options */
    optionService: SeatMapQueryOptionService;
}

/**
 * Public controller interface for SeatMap endpoints.
 *
 * Extends base CRUD behavior with SeatMap-specific actions.
 */
export interface ISeatMapController
    extends BaseControllerCRUDMethods<SeatMapSchemaFields> {

    /**
     * Creates seat maps for a given showing.
     *
     * @param req - Express request containing the showing ID
     * @param res - Express response object
     */
    createSeatMap(req: Request, res: Response): Promise<Response>;

    /**
     * Toggles availability for a seat map.
     *
     * @param req - Express request containing the seat map ID
     * @param res - Express response object
     */
    toggleSeatMapAvailability(req: Request, res: Response): Promise<Response>;
}
