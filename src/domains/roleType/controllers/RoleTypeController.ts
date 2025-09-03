import BaseCRUDController from "../../../shared/controller/base-crud-controller/BaseCRUDController.js";
import type IRoleType from "../model/RoleType.interface.js";
import type RoleTypeQueryOptionService from "../services/RoleTypeQueryOptionService.js";
import type {FilterQuery} from "mongoose";
import type {Request} from "express";
import type {
    IBaseCRUDController,
    IBaseCRUDControllerConstructor
} from "../../../shared/controller/base-crud-controller/BaseCRUDController.types.js";

/**
 * Constructor options for {@link RoleTypeController}.
 * Extends the base CRUD controller constructor with a required
 * {@link RoleTypeQueryOptionService}.
 */
export interface IRoleTypeControllerConstructor extends IBaseCRUDControllerConstructor<IRoleType> {
    /** Service used to parse query params and generate Mongoose match filters. */
    optionService: RoleTypeQueryOptionService;
}

/**
 * Public interface for {@link RoleTypeController}.
 * Extends the base CRUD controller interface.
 */
export interface IRoleTypeController extends IBaseCRUDController {}

/**
 * Controller responsible for handling CRUD operations for {@link IRoleType}.
 *
 * Extends {@link BaseCRUDController} and adds the ability to:
 * - Parse query parameters from incoming requests
 * - Generate Mongoose-compatible match filters
 */
export default class RoleTypeController
    extends BaseCRUDController<IRoleType>
    implements IRoleTypeController
{
    /** Service used to process query options and build filters. */
    optionService: RoleTypeQueryOptionService;

    /**
     * Creates a new RoleTypeController.
     *
     * @param constructorParams - The constructor parameters.
     * @param constructorParams.optionService - Service used for building query filters.
     * @param constructorParams.superParams - Parameters required by the base CRUD controller.
     */
    constructor({ optionService, ...superParams }: IRoleTypeControllerConstructor) {
        super(superParams);
        this.optionService = optionService;
    }

    /**
     * Builds Mongoose query filters based on the current request's query parameters.
     *
     * @param req - Express request containing query parameters.
     * @returns A Mongoose {@link FilterQuery} for {@link IRoleType}.
     */
    fetchURLMatchFilters(req: Request): FilterQuery<IRoleType> {
        const params = this.optionService.fetchQueryParams(req);
        return this.optionService.generateMatchFilters(params);
    }
}