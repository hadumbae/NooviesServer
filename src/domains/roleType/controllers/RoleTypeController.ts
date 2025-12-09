import BaseCRUDController from "../../../shared/controller/base-crud-controller/BaseCRUDController.js";
import type IRoleType from "../model/RoleType.interface.js";
import type RoleTypeQueryOptionService from "../services/RoleTypeQueryOptionService.js";
import type { Request } from "express";
import type {
    BaseControllerCRUDMethods,
    IBaseCRUDControllerConstructor
} from "../../../shared/controller/base-crud-controller/BaseControllerCRUDMethods.js";
import type { QueryOptionTypes } from "../../../shared/types/query-options/QueryOptionService.types.js";
import type { RoleTypeQueryMatchFilters } from "../schemas/filters/RoleTypeOption.types.js";

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
 * Inherits CRUD operations from {@link BaseControllerCRUDMethods}.
 */
export interface IRoleTypeController extends BaseControllerCRUDMethods {}

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
 * // Example: GET /role-types?roleName=Director&sortByRoleName=1
 * // Controller will:
 * // - Match role types with roleName "Director"
 * // - Sort results by roleName ascending
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
     * Fetches query options (filters and sorts) for RoleType documents
     * based on the request parameters.
     *
     * @param req - Express request containing query parameters
     * @returns Query options suitable for Mongoose queries
     *
     * @example
     * // GET /role-types?roleName=Director&sortByRoleName=1
     * // Returns:
     * // { match: { filters: { roleName: /Director/i }, sorts: { roleName: 1 } } }
     */
    fetchQueryOptions(req: Request): QueryOptionTypes<IRoleType, RoleTypeQueryMatchFilters> {
        const params = this.optionService.fetchQueryParams(req);
        return this.optionService.generateQueryOptions(params);
    }
}
