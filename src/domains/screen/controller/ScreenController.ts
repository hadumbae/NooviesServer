import BaseCRUDController from "../../../shared/controller/base-crud-controller/BaseCRUDController.js";
import type { IScreen } from "../interface/IScreen.js";
import type { Request, Response } from "express";
import ScreenQueryOptionService from "../service/ScreenQueryOptionService.js";
import ScreenService from "../service/ScreenService.js";
import type { FilterQuery, SortOrder } from "mongoose";
import type ScreenSeatService from "../service/screen-seat-service/ScreenSeatService.js";
import isValidObjectId from "../../../shared/utility/query/isValidObjectId.js";
import type {
    IBaseCRUDController,
    IBaseCRUDControllerConstructor
} from "../../../shared/controller/base-crud-controller/BaseCRUDController.types.js";

/**
 * Public interface for a ScreenController.
 *
 * Extends the base CRUD controller and adds screen-specific endpoints
 * for fetching screens by theatre and seats by row.
 */
export interface IScreenController extends IBaseCRUDController {
    /**
     * Fetches a paginated list of screens for a specific theatre.
     *
     * @param req - Express request (expects `params._id` for theatre ID)
     * @param res - Express response
     * @returns JSON response containing `totalItems` and `items` (screens)
     */
    getScreensByTheatre(req: Request, res: Response): Promise<Response>;
}

/**
 * Constructor parameters for {@link ScreenController}.
 *
 * Extends the base CRUD controller constructor with screen-specific services.
 */
export interface IScreenControllerConstructor extends IBaseCRUDControllerConstructor<IScreen> {
    /** Service for CRUD operations and business logic on screens. */
    service: ScreenService;

    /** Service for parsing query options for screens. */
    optionService: ScreenQueryOptionService;

    /** Service for fetching and manipulating seats in a screen. */
    seatService: ScreenSeatService;
}

/**
 * Controller for managing screens and related endpoints.
 *
 * Extends {@link BaseCRUDController} and provides:
 * - Pagination and filtering of screens
 * - Fetching screens by theatre
 * - Fetching seats grouped by row
 */
export default class ScreenController extends BaseCRUDController<IScreen> implements IScreenController {
    /** Service handling screen CRUD operations and business logic. */
    protected service: ScreenService;

    /** Service for extracting and validating query parameters for screens. */
    protected optionService: ScreenQueryOptionService;

    /** Service for managing seat data for screens. */
    protected seatService: ScreenSeatService;

    /**
     * Creates a new instance of {@link ScreenController}.
     *
     * @param params - Constructor parameters including services and base CRUD options
     */
    constructor(params: IScreenControllerConstructor) {
        const { service, optionService, seatService, ...baseParams } = params;
        super({ ...baseParams });

        this.service = service;
        this.optionService = optionService;
        this.seatService = seatService;
    }

    /**
     * Generates MongoDB filter object based on request query parameters.
     *
     * @param req - Express request
     * @returns FilterQuery object for Mongoose queries
     */
    fetchURLMatchFilters(req: Request): FilterQuery<any> {
        const queryParams = this.optionService.fetchQueryParams(req);
        return this.optionService.generateMatchFilters(queryParams);
    }

    /**
     * Generates MongoDB sort object based on request query parameters.
     *
     * @param req - Express request
     * @returns Partial mapping of {@link IScreen} fields to {@link SortOrder}
     */
    fetchURLQuerySorts(req: Request): Partial<Record<keyof IScreen, SortOrder>> {
        const params = this.optionService.fetchQueryParams(req);
        return this.optionService.generateQuerySorts(params);
    }

    /**
     * Fetches a paginated list of screens for a specific theatre.
     *
     * @param req - Express request (expects `params._id` for theatre ID)
     * @param res - Express response
     * @returns JSON containing `totalItems` and `items` (screens)
     */
    async getScreensByTheatre(req: Request, res: Response): Promise<Response> {
        const { _id: theatreID } = req.params;

        const { page, perPage } = this.queryUtils.fetchPaginationFromQuery(req);
        const queryParams = this.optionService.fetchQueryParams(req);
        const { showingsPerScreen } = this.optionService.generateParams(queryParams);

        const totalItems = await this.repository.count({ filters: { theatre: theatreID } });
        const screens = await this.service.fetchPaginatedScreensByTheatre({
            page,
            perPage,
            theatreID,
            showingsPerScreen,
        });

        return res.status(200).json({ totalItems, items: screens });
    }

    /**
     * Fetches all seats for a given screen, grouped by row.
     *
     * @param req - Express request (expects `params._id` for screen ID)
     * @param res - Express response
     * @returns JSON object containing seats organized by row
     */
    async getSeatsByRow(req: Request, res: Response): Promise<Response> {
        const { _id } = req.params;
        const screenID = isValidObjectId(_id);

        const { populate } = this.queryUtils.fetchOptionsFromQuery(req);
        const seatsByRow = await this.seatService.fetchSeatsByRow({ screenID, populate });

        return res.status(200).json(seatsByRow);
    }
}
