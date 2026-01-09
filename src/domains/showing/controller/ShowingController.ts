import type { Request } from "express";
import BaseCRUDController from "../../../shared/controller/base-crud-controller/BaseCRUDController.js";
import type {
    BaseControllerCRUDMethods,
    IBaseCRUDControllerConstructor
} from "../../../shared/controller/base-crud-controller/BaseControllerCRUDMethods.js";
import type ShowingQueryOptionService from "../service/query-option/ShowingQueryOptionService.js";
import type { QueryOptionTypes } from "../../../shared/types/query-options/QueryOptionService.types.js";
import type { ShowingSchemaFields } from "../model/Showing.types.js";
import type {ShowingQueryMatchFilters} from "../schema/query/ShowingMatchParams.js";

/**
 * HTTP controller method contract for Showings.
 *
 * @remarks
 * Extends the base CRUD controller contract with
 * Showing-specific query filter typing.
 */
export interface ShowingControllerMethods
    extends BaseControllerCRUDMethods<
        ShowingSchemaFields,
        ShowingQueryMatchFilters
    > {}

/**
 * Constructor parameters for {@link ShowingController}.
 */
export interface ShowingControllerConstructor
    extends IBaseCRUDControllerConstructor<ShowingSchemaFields> {
    /** Service responsible for parsing and generating Showing query options. */
    queryService: ShowingQueryOptionService;
}

/**
 * HTTP controller for the Showing domain.
 *
 * @remarks
 * A thin orchestration layer responsible for:
 * - Delegating CRUD operations to the base controller
 * - Translating HTTP query parameters into domain-aware query options
 *
 * All business logic and data access is handled by repositories and services.
 */
export default class ShowingController
    extends BaseCRUDController<ShowingSchemaFields>
    implements ShowingControllerMethods {

    /** Query option service for Showing-specific filters and sorting. */
    readonly queryService: ShowingQueryOptionService;

    /**
     * Creates a new {@link ShowingController}.
     *
     * @param params - Controller dependencies.
     */
    constructor(params: ShowingControllerConstructor) {
        const { queryService, ...superParams } = params;
        super(superParams);

        this.queryService = queryService;
    }

    /**
     * Resolves query options for a Showing list request.
     *
     * @param req - Express request containing raw query parameters.
     * @returns Generated query options suitable for repository execution.
     */
    fetchQueryOptions(
        req: Request
    ): QueryOptionTypes<ShowingSchemaFields, ShowingQueryMatchFilters> {
        const options = this.queryService.fetchQueryParams(req);
        return this.queryService.generateQueryOptions(options);
    }
}
