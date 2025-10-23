import BaseCRUDController from "../../../shared/controller/base-crud-controller/BaseCRUDController.js";
import type {IScreen} from "../interface/IScreen.js";
import type {Request, Response} from "express";
import ScreenQueryOptionService from "../service/ScreenQueryOptionService.js";
import ScreenService from "../service/ScreenService.js";
import type ScreenSeatService from "../service/screen-seat-service/ScreenSeatService.js";
import isValidObjectId from "../../../shared/utility/mongoose/isValidObjectId.js";
import type {
    IBaseCRUDController,
    IBaseCRUDControllerConstructor
} from "../../../shared/controller/base-crud-controller/BaseCRUDController.types.js";
import type {QueryOptionTypes} from "../../../shared/types/query-options/QueryOptionService.types.js";
import type {ScreenQueryMatchFilters} from "../schema/query/ScreenQueryOption.types.js";

/**
 * Public interface for a ScreenController.
 *
 * Extends the base CRUD controller with screen-specific endpoints
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

    /**
     * Fetches all seats for a given screen, grouped by row.
     *
     * @param req - Express request (expects `params._id` for screen ID)
     * @param res - Express response
     * @returns JSON object containing seats organized by row
     */
    getSeatsByRow(req: Request, res: Response): Promise<Response>;
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
 *
 * @example
 * // Fetch paginated screens for a theatre:
 * // GET /theatres/:id/screens?page=1&perPage=10
 *
 * // Fetch seats for a screen grouped by row:
 * // GET /screens/:id/seats
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
        const {service, optionService, seatService, ...baseParams} = params;
        super({...baseParams});

        this.service = service;
        this.optionService = optionService;
        this.seatService = seatService;
    }

    /**
     * Fetches query options for screens from the request.
     *
     * @param req - Express request object
     * @returns {@link QueryOptionTypes} for screens
     */
    fetchQueryOptions(req: Request): QueryOptionTypes<IScreen, ScreenQueryMatchFilters> {
        const params = this.optionService.fetchQueryParams(req);
        return this.optionService.generateQueryOptions(params);
    }

    /**
     * Fetches a paginated list of screens for a specific theatre.
     *
     * @param req - Express request (expects `params._id` for theatre ID)
     * @param res - Express response
     * @returns JSON containing `totalItems` and `items` (screens)
     */
    async getScreensByTheatre(req: Request, res: Response): Promise<Response> {
        const {_id: theatreID} = req.params;

        const {page, perPage} = this.queryUtils.fetchPaginationFromQuery(req);
        const queryParams = this.optionService.fetchQueryParams(req);
        const {showingsPerScreen} = this.optionService.generateParams(queryParams);

        const totalItems = await this.repository.count({filters: {theatre: theatreID}});
        const screens = await this.service.fetchPaginatedScreensByTheatre({
            page,
            perPage,
            theatreID,
            showingsPerScreen,
        });

        return res.status(200).json({totalItems, items: screens});
    }

    /**
     * Fetches all seats for a given screen, grouped by row.
     *
     * @param req - Express request (expects `params._id` for screen ID)
     * @param res - Express response
     * @returns JSON object containing seats organized by row
     */
    async getSeatsByRow(req: Request, res: Response): Promise<Response> {
        const {_id} = req.params;
        const screenID = isValidObjectId(_id);

        const {populate} = this.queryUtils.fetchOptionsFromQuery(req);
        const seatsByRow = await this.seatService.fetchSeatsByRow({screenID, populate});

        return res.status(200).json(seatsByRow);
    }
}
