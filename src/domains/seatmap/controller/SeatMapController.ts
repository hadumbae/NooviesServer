import type { Request, Response } from "express";

import BaseCRUDController from "../../../shared/controller/base-crud-controller/BaseCRUDController.js";

import type ISeatMap from "../model/SeatMap.interface.js";
import SeatMapQueryOptionService from "../service/query-option/SeatMapQueryOptionService.js";
import type {
    IBaseCRUDController,
    IBaseCRUDControllerConstructor
} from "../../../shared/controller/base-crud-controller/BaseCRUDController.types.js";
import type SeatMapService from "../service/seat-map-service/SeatMapService.js";
import isValidObjectId from "../../../shared/utility/mongoose/isValidObjectId.js";

/**
 * Constructor parameters for `SeatMapController`.
 *
 * Extends the base CRUD controller constructor with required service instances.
 */
export interface ISeatMapControllerConstructor extends IBaseCRUDControllerConstructor<ISeatMap> {
    /** Instance of the `SeatMapService` handling seat map business logic. */
    service: SeatMapService;

    /** Instance of the `SeatMapQueryService` for querying seat map data. */
    queryService: SeatMapQueryOptionService;
}

/**
 * Controller interface for `SeatMap` HTTP endpoints.
 *
 * Extends the base CRUD controller with seat map-specific methods.
 */
export interface ISeatMapController extends IBaseCRUDController {
    /**
     * Creates a seat map for a specific showing.
     *
     * @param req - Express request object containing showing ID in `req.params._id`.
     * @param res - Express response object.
     * @returns A JSON response indicating success.
     */
    createSeatMap(req: Request, res: Response): Promise<Response>;

    /**
     * Toggles the availability of a specific seat map.
     *
     * @param req - Express request object containing seat map ID in `req.params._id`.
     * @param res - Express response object.
     * @returns A JSON response containing the updated seat map.
     */
    toggleSeatMapAvailability(req: Request, res: Response): Promise<Response>;
}

/**
 * Controller class for handling `SeatMap` endpoints.
 *
 * Provides CRUD operations via `BaseCRUDController` and additional
 * seat map-specific actions such as creation and toggling availability.
 */
export default class SeatMapController extends BaseCRUDController<ISeatMap> implements ISeatMapController {
    /** Service for performing seat map business logic. */
    protected service: SeatMapService;

    /** Service for querying seat map data. */
    protected queryService: SeatMapQueryOptionService;

    /**
     * Creates a new `SeatMapController` instance.
     *
     * @param params - Object containing service instances and base controller parameters.
     *
     * @example
     * ```ts
     * const controller = new SeatMapController({
     *   service: seatMapService,
     *   queryService: seatMapQueryService,
     *   model: SeatMapModel
     * });
     * ```
     */
    constructor(params: ISeatMapControllerConstructor) {
        const { service, queryService, ...superParams } = params;
        super(superParams);

        this.service = service;
        this.queryService = queryService;
    }

    /**
     * Creates seat maps for a given showing ID from the request parameters.
     *
     * @param req - Express request object containing `_id` param for the showing.
     * @param res - Express response object.
     * @returns JSON response with a success message.
     *
     * @example
     * ```ts
     * POST /showings/:_id/seat-map
     * ```
     */
    async createSeatMap(req: Request, res: Response): Promise<Response> {
        const { _id } = req.params;
        const showingID = isValidObjectId(_id);

        await this.service.createShowingSeatMap({ showingID });
        return res.status(200).json({ message: "Seat Map created." });
    }

    /**
     * Toggles the availability of a seat map by its ID from the request parameters.
     *
     * @param req - Express request object containing `_id` param for the seat map.
     * @param res - Express response object.
     * @returns JSON response with the updated `ISeatMap` object.
     *
     * @example
     * ```ts
     * PATCH /seat-maps/:_id/toggle-availability
     * ```
     */
    async toggleSeatMapAvailability(req: Request, res: Response): Promise<Response> {
        const { _id } = req.params;
        const seatMapID = isValidObjectId(_id);

        const seatMap = await this.service.toggleSeatMapAvailability({ seatMapID });
        return res.status(200).json(seatMap);
    }
}
