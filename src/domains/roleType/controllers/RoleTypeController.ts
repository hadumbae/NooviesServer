import BaseCRUDController from "../../../shared/controller/base-crud-controller/BaseCRUDController.js";
import type IRoleType from "../model/RoleType.interface.js";
import type RoleTypeQueryOptionService from "../services/RoleTypeQueryOptionService.js";
import type { FilterQuery, SortOrder } from "mongoose";
import type { Request } from "express";
import type {
    IBaseCRUDController,
    IBaseCRUDControllerConstructor
} from "../../../shared/controller/base-crud-controller/BaseCRUDController.types.js";

/**
 * Constructor parameters for {@link RoleTypeController}.
 *
 * Extends {@link IBaseCRUDControllerConstructor} with a required
 * {@link RoleTypeQueryOptionService} for parsing queries.
 */
export interface IRoleTypeControllerConstructor extends IBaseCRUDControllerConstructor<IRoleType> {
    /** Service for parsing query params into match filters and sorts. */
    optionService: RoleTypeQueryOptionService;
}

/**
 * Public interface for the {@link RoleTypeController}.
 * Inherits CRUD operations from {@link IBaseCRUDController}.
 */
export interface IRoleTypeController extends IBaseCRUDController {}

/**
 * Controller for handling requests related to {@link IRoleType}.
 *
 * Extends {@link BaseCRUDController} to provide standard CRUD functionality,
 * and adds query handling capabilities using {@link RoleTypeQueryOptionService}.
 *
 * Responsibilities:
 * - Parse query parameters from incoming requests
 * - Build Mongoose `$match` filters
 * - Build Mongoose `$sort` options
 *
 * @example
 * // Example: GET /role-types?name=Director&sortByName=1
 * // Controller will:
 * // - Match role types with name "Director"
 * // - Sort results by name ascending
 */
export default class RoleTypeController
    extends BaseCRUDController<IRoleType>
    implements IRoleTypeController
{
    /** Service for extracting query params and converting them into filters/sorts. */
    optionService: RoleTypeQueryOptionService;

    /**
     * Creates a new {@link RoleTypeController}.
     *
     * @param params - Constructor parameters.
     * @param params.optionService - Service for parsing and building query filters.
     * @param params.superParams - Parameters passed through to the base CRUD controller.
     */
    constructor({ optionService, ...superParams }: IRoleTypeControllerConstructor) {
        super(superParams);
        this.optionService = optionService;
    }

    /**
     * Builds MongoDB `$match` filters from request query parameters.
     *
     * @param req - Express request object containing query parameters.
     * @returns A {@link FilterQuery} for filtering {@link IRoleType} documents.
     *
     * @example
     * // ?name=Actor
     * // Returns: { name: "Actor" }
     */
    fetchURLMatchFilters(req: Request): FilterQuery<IRoleType> {
        const params = this.optionService.fetchQueryParams(req);
        return this.optionService.generateMatchFilters(params);
    }

    /**
     * Builds MongoDB `$sort` options from request query parameters.
     *
     * @param req - Express request object containing query parameters.
     * @returns A partial record mapping {@link IRoleType} fields to sort orders
     *          (`1` for ascending, `-1` for descending).
     *
     * @example
     * // ?sortByName=1
     * // Returns: { name: 1 }
     */
    fetchURLQuerySorts(req: Request): Partial<Record<keyof IRoleType, SortOrder>> {
        const params = this.optionService.fetchQueryParams(req);
        return this.optionService.generateQuerySorts(params);
    }
}
