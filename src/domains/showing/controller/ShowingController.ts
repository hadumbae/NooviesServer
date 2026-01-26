/**
 * @file ShowingController.ts
 *
 * HTTP controller for the Showing domain.
 *
 * Acts as a thin orchestration layer between:
 * - Express request handling
 * - Query option parsing and transformation
 * - Base CRUD controller execution
 *
 * This controller contains **no business logic** and delegates:
 * - Data access to repositories
 * - Query construction to the Showing query option service
 */

import type { Request } from "express";
import BaseCRUDController from "../../../shared/controller/base-crud-controller/BaseCRUDController.js";
import type {
    BaseControllerCRUDMethods,
    IBaseCRUDControllerConstructor
} from "../../../shared/controller/base-crud-controller/BaseControllerCRUDMethods.js";
import type ShowingQueryOptionService from "../service/query-option/ShowingQueryOptionService.js";
import type { QueryOptionTypes } from "../../../shared/types/query-options/QueryOptionService.types.js";
import type { ShowingSchemaFields } from "../model/showing/Showing.types.js";
import type { ShowingQueryMatchFilters } from "../schema/query/ShowingMatchParams.js";
import type { PopulationPipelineStages } from "../../../shared/types/mongoose/AggregatePipelineStages.js";

/**
 * HTTP controller method contract for Showing resources.
 *
 * @remarks
 * Extends the base CRUD controller interface with
 * Showing-specific match filter typing.
 */
export interface ShowingControllerMethods
    extends BaseControllerCRUDMethods<
        ShowingSchemaFields,
        ShowingQueryMatchFilters
    > {}

/**
 * Constructor dependencies for {@link ShowingController}.
 */
export interface ShowingControllerConstructor
    extends IBaseCRUDControllerConstructor<ShowingSchemaFields> {

    /**
     * Service responsible for:
     * - Parsing incoming HTTP query parameters
     * - Generating validated match, reference, and sort options
     * - Producing aggregation population pipelines
     */
    queryService: ShowingQueryOptionService;
}

/**
 * Controller implementation for Showing endpoints.
 *
 * @remarks
 * Responsibilities:
 * - Delegate CRUD execution to {@link BaseCRUDController}
 * - Translate HTTP query parameters into domain-aware query options
 * - Provide population pipelines for aggregate-based queries
 *
 * All domain logic and persistence concerns are handled by
 * services and repositories.
 */
export default class ShowingController
    extends BaseCRUDController<ShowingSchemaFields>
    implements ShowingControllerMethods {

    /** Query option service for Showing-specific filtering and sorting. */
    readonly queryService: ShowingQueryOptionService;

    /**
     * Create a new {@link ShowingController}.
     *
     * @param params - Controller dependencies.
     */
    constructor(params: ShowingControllerConstructor) {
        const { queryService, ...superParams } = params;
        super(superParams);

        this.queryService = queryService;
    }

    /**
     * Resolve query options for a Showing list request.
     *
     * @remarks
     * Converts raw HTTP query parameters into a structured
     * {@link QueryOptionTypes} object suitable for repository execution.
     *
     * @param req - Express request containing query parameters.
     * @returns Normalized query options for list and aggregate queries.
     */
    fetchQueryOptions(
        req: Request
    ): QueryOptionTypes<ShowingSchemaFields, ShowingQueryMatchFilters> {
        const options = this.queryService.fetchQueryParams(req);
        return this.queryService.generateQueryOptions(options);
    }

    /**
     * Generate aggregation population pipelines for Showing queries.
     *
     * @remarks
     * Used when reference-based filters or sorts require aggregation.
     *
     * @returns Aggregation pipeline stages for populating references.
     */
    fetchPopulatePipelines(): PopulationPipelineStages {
        return this.queryService.generatePopulationPipelines();
    }
}
