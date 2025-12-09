import type { Request, Response } from "express";
import BaseCRUDController from "../../../shared/controller/base-crud-controller/BaseCRUDController.js";
import type ISeat from "../model/Seat.interface.js";
import SeatQueryOptionService from "../service/SeatQueryOptionService.js";
import type SeatQueryService from "../service/query-service/SeatQueryService.js";
import type {
    BaseControllerCRUDMethods,
    IBaseCRUDControllerConstructor
} from "../../../shared/controller/base-crud-controller/BaseControllerCRUDMethods.js";
import type { SeatsByRowSubmitData } from "../schema/seats/SeatInput.types.js";
import type { QueryOptionTypes } from "../../../shared/types/query-options/QueryOptionService.types.js";
import type { SeatQueryMatchFilters } from "../schema/query/SeatQueryOption.types.js";

/**
 * Constructor parameters for {@link SeatController}.
 *
 * Extends {@link IBaseCRUDControllerConstructor} and adds seat-specific services:
 * - {@link SeatQueryService} for handling custom seat queries and batch operations
 * - {@link SeatQueryOptionService} for parsing and validating seat query parameters
 */
export interface ISeatControllerConstructor extends IBaseCRUDControllerConstructor<ISeat> {
    /** Service for custom seat queries and batch operations. */
    queryService: SeatQueryService;

    /** Service for parsing and validating seat query options. */
    optionService: SeatQueryOptionService;
}

/**
 * Public interface for {@link SeatController}.
 *
 * Extends {@link BaseControllerCRUDMethods} and can be extended to add additional seat-specific endpoints.
 */
export interface ISeatController extends BaseControllerCRUDMethods {}

/**
 * Controller responsible for managing {@link ISeat} documents.
 *
 * Extends {@link BaseCRUDController} to provide standard CRUD functionality,
 * and adds seat-specific features:
 * - Parsing query options via {@link SeatQueryOptionService}
 * - Batch seat creation for rows via {@link SeatQueryService}
 *
 * @example
 * // Create seats for a row:
 * // POST /seats/row
 * // Request body conforms to {@link SeatsByRowSubmitData}
 */
export default class SeatController extends BaseCRUDController<ISeat> implements ISeatController {
    /** Service for executing custom seat queries and batch operations. */
    protected queryService: SeatQueryService;

    /** Service for parsing and generating query options for seats. */
    protected optionService: SeatQueryOptionService;

    /**
     * Creates a new {@link SeatController} instance.
     *
     * @param params - Constructor parameters including base CRUD options and seat-specific services
     */
    constructor(params: ISeatControllerConstructor) {
        const { optionService, queryService, ...superParams } = params;
        super(superParams);

        this.optionService = optionService;
        this.queryService = queryService;
    }

    /**
     * Fetches query options for seats from the request.
     *
     * Uses {@link SeatQueryOptionService} to parse filters, sorts, and additional options.
     *
     * @param req - Express request
     * @returns Parsed query options compatible with Mongoose queries
     */
    fetchQueryOptions(req: Request): QueryOptionTypes<ISeat, SeatQueryMatchFilters> {
        const params = this.optionService.fetchQueryParams(req);
        return this.optionService.generateQueryOptions(params);
    }

    /**
     * Creates multiple seats for a specified row in a theatre screen.
     *
     * Expects a validated request body following {@link SeatsByRowSubmitData}.
     *
     * @param req - Express request containing `validatedBody` with seat creation data
     * @param res - Express response
     * @returns JSON response containing the created seat documents
     */
    async createSeatsByRow(req: Request, res: Response): Promise<Response> {
        const data = req.validatedBody as SeatsByRowSubmitData;
        const seats = await this.queryService.createByRow(data);
        return res.status(200).json(seats);
    }
}
