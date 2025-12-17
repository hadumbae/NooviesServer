import type { Request, Response } from "express";
import BaseCRUDController from "../../../shared/controller/base-crud-controller/BaseCRUDController.js";
import type IShowing from "../model/IShowing.js";
import type ShowingCRUDService from "../service/ShowingCRUDService.js";
import type {
    BaseControllerCRUDMethods,
    IBaseCRUDControllerConstructor
} from "../../../shared/controller/base-crud-controller/BaseControllerCRUDMethods.js";
import type { ShowingInput } from "../schema/ShowingInputSchema.js";
import isValidObjectId from "../../../shared/utility/mongoose/isValidObjectId.js";
import type { ShowingQueryMatchFilters } from "../schema/query/ShowingQueryOption.types.js";
import type ShowingQueryOptionService from "../service/query-option/ShowingQueryOptionService.js";
import type { QueryOptionTypes } from "../../../shared/types/query-options/QueryOptionService.types.js";

/**
 * Interface for Showing controller methods.
 *
 * @remarks
 * Extends base CRUD methods with showing-specific types.
 */
export interface ShowingControllerMethods extends BaseControllerCRUDMethods<IShowing, ShowingQueryMatchFilters> {}

/**
 * Constructor parameters for {@link ShowingController}.
 */
export interface ShowingControllerConstructor extends IBaseCRUDControllerConstructor<IShowing> {
    /** Service handling create/update operations for showings. */
    crudService: ShowingCRUDService;
    /** Service handling query operations for showings. */
    queryService: ShowingQueryOptionService;
}

/**
 * Controller for managing HTTP requests related to showings.
 *
 * @remarks
 * Extends {@link BaseCRUDController} to leverage standard CRUD functionality.
 * Provides methods for creating, updating, and querying showings.
 * Integrates {@link ShowingCRUDService} and {@link ShowingQueryOptionService}.
 */
export default class ShowingController extends BaseCRUDController<IShowing> implements ShowingControllerMethods {
    /** Service for creating and updating showings. */
    crudService: ShowingCRUDService;

    /** Service for querying showings and generating query pipelines. */
    queryService: ShowingQueryOptionService;

    /**
     * Creates an instance of {@link ShowingController}.
     *
     * @param params - Constructor parameters including `crudService` and `queryService`.
     */
    constructor(params: ShowingControllerConstructor) {
        const { queryService, crudService, ...superParams } = params;
        super(superParams);

        this.crudService = crudService;
        this.queryService = queryService;
    }

    /**
     * Handles HTTP POST requests to create a new showing.
     *
     * @param req - Express request object with validated showing data in `req.validatedBody`.
     * @param res - Express response object used to return the created showing.
     * @returns The created {@link IShowing} as JSON with HTTP 200 status.
     *
     * @example
     * ```ts
     * POST /api/showings
     * {
     *   "movie": "ObjectId",
     *   "theatre": "ObjectId",
     *   "startAt": "2025-11-04T18:00:00Z"
     * }
     * ```
     */
    async create(req: Request, res: Response): Promise<Response> {
        const { populate, virtuals } = this.queryUtils.fetchOptionsFromQuery(req);
        const data = req.validatedBody as ShowingInput;

        const showing = await this.crudService.create({ data, populate, virtuals });
        return res.status(200).json(showing);
    }

    /**
     * Handles HTTP PUT/PATCH requests to update an existing showing.
     *
     * @param req - Express request object with `_id` in `req.params` and updated data in `req.validatedBody`.
     * @param res - Express response object used to return the updated showing.
     * @returns The updated {@link IShowing} as JSON with HTTP 200 status.
     *
     * @throws {Error} If `_id` is not a valid ObjectId.
     *
     * @example
     * ```ts
     * PATCH /api/showings/652aef...
     * {
     *   "startAt": "2025-11-05T20:00:00Z"
     * }
     * ```
     */
    async update(req: Request, res: Response): Promise<Response> {
        const { _id } = req.params;
        const showingID = isValidObjectId(_id);

        const { populate, virtuals } = this.queryUtils.fetchOptionsFromQuery(req);
        const data = req.validatedBody as ShowingInput;

        const showing = await this.crudService.update({ _id: showingID, data, populate, virtuals });
        return res.status(200).json(showing);
    }

    /**
     * Fetches and generates query options for showings from an Express request.
     *
     * @param req - Express request object containing query parameters.
     * @returns Combined query options including native and reference filters and sorts.
     */
    fetchQueryOptions(req: Request): QueryOptionTypes<IShowing, any> {
        const options = this.queryService.fetchQueryParams(req);
        return this.queryService.generateQueryOptions(options);
    }
}
