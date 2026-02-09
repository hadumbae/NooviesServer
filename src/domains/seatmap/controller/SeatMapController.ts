/**
 * @file SeatMapController.ts
 *
 * HTTP controller for SeatMap endpoints.
 *
 * Extends the base CRUD controller with SeatMap-specific actions,
 * including creation and availability toggling.
 */

import type {Request, Response} from "express";

import BaseCRUDController from "../../../shared/controller/base-crud-controller/BaseCRUDController.js";

import SeatMapQueryOptionService from "../service/query-option/SeatMapQueryOptionService.js";
import type SeatMapService from "../service/seat-map-service/SeatMapService.js";
import isValidObjectId from "../../../shared/utility/mongoose/isValidObjectId.js";
import type {SeatMapSchemaFields} from "../model/SeatMap.types.js";
import type {QueryOptionTypes} from "../../../shared/types/query-options/QueryOptionService.types.js";
import type {SeatMapMatchFilters} from "../schema/query-option/SeatMapMatchParam.schema.js";
import type {ISeatMapController, ISeatMapControllerConstructor} from "./SeatMapController.types.js";

/**
 * SeatMap HTTP controller.
 *
 * Provides base CRUD functionality and
 * SeatMap-specific write operations.
 */
export default class SeatMapController
    extends BaseCRUDController<SeatMapSchemaFields>
    implements ISeatMapController {

    /** SeatMap domain logic service */
    protected service: SeatMapService;

    /** SeatMap query option service */
    protected optionService: SeatMapQueryOptionService;

    /**
     * Creates a new SeatMapController.
     *
     * @param params - Controller dependencies and base configuration
     */
    constructor(params: ISeatMapControllerConstructor) {
        const { service, optionService, ...superParams } = params;
        super(superParams);

        this.service = service;
        this.optionService = optionService;
    }

    /**
     * Resolves query options for SeatMap list endpoints.
     */
    fetchQueryOptions(
        req: Request
    ): QueryOptionTypes<SeatMapSchemaFields, SeatMapMatchFilters> {
        const params = this.optionService.fetchQueryParams(req);
        return this.optionService.generateQueryOptions(params);
    }

    /**
     * Creates seat maps for a showing.
     *
     * @example
     * POST /showings/:_id/seat-map
     */
    async createSeatMap(req: Request, res: Response): Promise<Response> {
        const { _id } = req.params;
        const showingID = isValidObjectId(_id);

        await this.service.createShowingSeatMap({ showingID });
        return res.status(200).json({ message: "Seat Map created." });
    }

    /**
     * Toggles seat map availability.
     *
     * @example
     * PATCH /seat-maps/:_id/toggle-availability
     */
    async toggleSeatMapAvailability(req: Request, res: Response): Promise<Response> {
        const { _id } = req.params;
        const seatMapID = isValidObjectId(_id);

        const seatMap =
            await this.service.toggleSeatMapAvailability({ seatMapID });

        return res.status(200).json(seatMap);
    }
}
