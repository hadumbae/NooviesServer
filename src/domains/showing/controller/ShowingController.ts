import type {Request, Response} from "express";
import BaseCRUDController from "../../../shared/controller/base-crud-controller/BaseCRUDController.js";
import type IShowing from "../model/IShowing.js";
import ShowingQueryService from "../service/ShowingQueryService.js";
import type ShowingCRUDService from "../service/ShowingCRUDService.js";
import type {
    BaseControllerCRUDMethods,
    IBaseCRUDControllerConstructor
} from "../../../shared/controller/base-crud-controller/BaseControllerCRUDMethods.js";
import type {ShowingInput} from "../schema/ShowingInputSchema.js";
import isValidObjectId from "../../../shared/utility/mongoose/isValidObjectId.js";

/**
 * Interface representing the controller for showing entities.
 *
 * @remarks
 * Extends the base CRUD controller interface to provide
 * showing-specific controller behavior.
 */
export interface IShowingController extends BaseControllerCRUDMethods {}

/**
 * Constructor parameters for {@link ShowingController}.
 */
export interface IShowingControllerConstructor extends IBaseCRUDControllerConstructor<IShowing> {
    /** Service responsible for create/update logic of showings. */
    crudService: ShowingCRUDService;
    /** Service responsible for query and retrieval logic of showings. */
    queryService: ShowingQueryService;
}

/**
 * Express controller for handling HTTP operations related to {@link IShowing}.
 *
 * @remarks
 * - Extends {@link BaseCRUDController} to leverage standard CRUD functionality.
 * - Implements custom logic for `create` and `update` endpoints.
 * - Integrates with {@link ShowingCRUDService} and {@link ShowingQueryService}.
 */
export default class ShowingController
    extends BaseCRUDController<IShowing>
    implements IShowingController
{
    /** Service for handling create and update operations for showings. */
    crudService: ShowingCRUDService;

    /** Service for handling query operations for showings. */
    queryService: ShowingQueryService;

    /**
     * Creates a new instance of {@link ShowingController}.
     *
     * @param params - Configuration and dependency parameters for controller construction.
     * Must include both {@link ShowingCRUDService} and {@link ShowingQueryService}.
     */
    constructor(params: IShowingControllerConstructor) {
        const {queryService, crudService, ...superParams} = params;
        super(superParams);

        this.crudService = crudService;
        this.queryService = queryService;
    }

    /**
     * Handles HTTP POST requests for creating a new showing.
     *
     * @param req - Express request object, expected to contain a validated showing body (`req.validatedBody`).
     * @param res - Express response object used to send the created showing.
     * @returns The created {@link IShowing} as a JSON response with HTTP 200 status.
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
        const {populate, virtuals} = this.queryUtils.fetchOptionsFromQuery(req);
        const data = req.validatedBody as ShowingInput;

        const showing = await this.crudService.create({data, populate, virtuals});
        return res.status(200).json(showing);
    }

    /**
     * Handles HTTP PUT/PATCH requests for updating an existing showing.
     *
     * @param req - Express request object containing the showing ID in `req.params._id`
     * and the updated showing data in `req.validatedBody`.
     * @param res - Express response object used to send the updated showing.
     * @returns The updated {@link IShowing} as a JSON response with HTTP 200 status.
     *
     * @throws {Error} If the provided `_id` parameter is not a valid ObjectId.
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
        const {_id} = req.params;
        const showingID = isValidObjectId(_id);

        const {populate, virtuals} = this.queryUtils.fetchOptionsFromQuery(req);
        const data = req.validatedBody as ShowingInput;

        const showing = await this.crudService.update({_id: showingID, data, populate, virtuals});
        return res.status(200).json(showing);
    }
}
