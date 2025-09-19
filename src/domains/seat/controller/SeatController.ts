import type {Request, Response} from "express";
import BaseCRUDController from "../../../shared/controller/base-crud-controller/BaseCRUDController.js";
import type ISeat from "../model/Seat.interface.js";
import SeatQueryOptionService from "../service/SeatQueryOptionService.js";
import type {FilterQuery, SortOrder} from "mongoose";
import type SeatQueryService from "../service/query-service/SeatQueryService.js";
import type {
    IBaseCRUDController,
    IBaseCRUDControllerConstructor
} from "../../../shared/controller/base-crud-controller/BaseCRUDController.types.js";
import type {SeatsByRowSubmitData} from "../schema/seats/Seat.types.js";

/**
 * Constructor parameters for {@link SeatController}.
 *
 * Extends the base CRUD controller constructor and adds:
 * - `queryService`: Service for handling seat-related queries and batch operations
 * - `optionService`: Service for parsing and validating seat query options
 */
export interface ISeatControllerConstructor extends IBaseCRUDControllerConstructor<ISeat> {
    queryService: SeatQueryService;
    optionService: SeatQueryOptionService;
}

/**
 * Interface for {@link SeatController}.
 *
 * Extends {@link IBaseCRUDController} and provides additional seat-specific endpoints.
 */
export interface ISeatController extends IBaseCRUDController {}

/**
 * Controller responsible for handling CRUD operations and custom endpoints for {@link ISeat}.
 *
 * Extends {@link BaseCRUDController} and adds:
 * - Query option parsing via {@link SeatQueryOptionService}
 * - Batch seat creation by row via {@link SeatQueryService}
 */
export default class SeatController extends BaseCRUDController<ISeat> implements ISeatController {
    protected queryService: SeatQueryService;
    protected optionService: SeatQueryOptionService;

    /**
     * Creates a new instance of {@link SeatController}.
     *
     * @param params - Constructor parameters including services and base CRUD options.
     */
    constructor(params: ISeatControllerConstructor) {
        const {optionService, queryService, ...superParams} = params;
        super(superParams);

        this.optionService = optionService;
        this.queryService = queryService;
    }

    /**
     * Generates MongoDB filter query based on the current request's query parameters.
     *
     * @param req - Express request object
     * @returns A {@link FilterQuery} object for seat matching
     */
    fetchURLMatchFilters(req: Request): FilterQuery<any> {
        const params = this.optionService.fetchQueryParams(req);
        return this.optionService.generateMatchFilters(params);
    }

    /**
     * Generates MongoDB sort specification based on the current request's query parameters.
     *
     * @param req - Express request object
     * @returns Partial mapping of {@link ISeat} keys to {@link SortOrder}
     */
    fetchURLQuerySorts(req: Request): Partial<Record<keyof ISeat, SortOrder>> {
        const params = this.optionService.fetchQueryParams(req);
        return this.optionService.generateQuerySorts(params);
    }

    /**
     * Creates multiple seats for a given row in a theatre screen.
     *
     * Expects a validated request body conforming to {@link SeatsByRowSubmitData}.
     *
     * @param req - Express request containing `validatedBody` with seat data
     * @param res - Express response
     * @returns JSON response with the created seat documents
     */
    async createSeatsByRow(req: Request, res: Response): Promise<Response> {
        const data = req.validatedBody as SeatsByRowSubmitData;
        const seats = await this.queryService.createByRow(data);
        return res.status(200).json(seats);
    }
}
