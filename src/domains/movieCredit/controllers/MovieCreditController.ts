import type {Request} from "express";
import BaseCRUDController from "../../../shared/controller/base-crud-controller/BaseCRUDController.js";
import type {IMovieCredit} from "../models/MovieCredit.interface.js";
import type MovieCreditQueryOptionService from "../services/MovieCreditQueryOptionService.js";
import type MovieCreditService from "../services/MovieCreditService.js";
import type {
    IBaseCRUDController,
    IBaseCRUDControllerConstructor
} from "../../../shared/controller/base-crud-controller/BaseCRUDController.types.js";
import type {FilterQuery, SortOrder} from "mongoose";
import type {
    PopulationPipelineStages,
    ReferenceFilterPipelineStages
} from "../../../shared/types/mongoose/AggregatePipelineStages.js";

/**
 * Constructor parameters for {@link MovieCreditController}.
 */
export interface IMovieCreditControllerConstructor extends IBaseCRUDControllerConstructor<IMovieCredit> {
    /** Service responsible for performing CRUD operations on movie credits. */
    service: MovieCreditService;
    /** Service responsible for extracting filters, sorts, and population options from queries. */
    optionService: MovieCreditQueryOptionService;
}

/**
 * Interface definition for the Movie Credit Controller.
 * Extends the base CRUD controller and adds access to
 * services specialized for movie credit operations.
 */
export interface IMovieCreditController extends IBaseCRUDController {
    /** Service for CRUD operations on movie credits. */
    service: MovieCreditService;
    /** Service for parsing and converting query parameters into database operations. */
    optionService: MovieCreditQueryOptionService;
}

/**
 * Controller for handling requests related to {@link IMovieCredit} documents.
 *
 * Extends {@link BaseCRUDController} to provide standard CRUD functionality,
 * and uses {@link MovieCreditQueryOptionService} to translate incoming
 * query parameters into MongoDB filters, sorts, and population pipelines.
 *
 * @example
 * // Example: GET /movie-credits?name=Tom&sortByMovie=1
 * // Controller will:
 * // - Match credits with person names like "Tom"
 * // - Sort results by movie ascending
 */
export default class MovieCreditController
    extends BaseCRUDController<IMovieCredit>
    implements IMovieCreditController {
    /** Service for CRUD operations on movie credits. */
    service: MovieCreditService;

    /** Service for building query filters, sorts, and population pipelines. */
    optionService: MovieCreditQueryOptionService;

    /**
     * Creates a new {@link MovieCreditController}.
     *
     * @param params - The constructor parameters including:
     *   - `service`: Service for CRUD operations.
     *   - `optionService`: Service for query handling.
     *   - other base controller parameters.
     */
    constructor(params: IMovieCreditControllerConstructor) {
        const {service, optionService, ...superParams} = params;
        super(superParams);

        this.service = service;
        this.optionService = optionService;
    }

    /**
     * Builds MongoDB `$match` filters from request query parameters.
     *
     * @param req - Express request object containing query parameters.
     * @returns A {@link FilterQuery} object for matching movie credits.
     *
     * @example
     * // ?department=Directing&billingOrder=1
     * // Returns: { department: "Directing", billingOrder: 1 }
     */
    fetchURLMatchFilters(req: Request): FilterQuery<any> {
        const options = this.optionService.fetchQueryParams(req);
        return this.optionService.generateMatchFilters(options);
    }

    /**
     * Builds MongoDB `$lookup`-based filters from request query parameters.
     *
     * @param req - Express request object containing query parameters.
     * @returns A {@link ReferenceFilterPipelineStages} array
     *          for joining and filtering related collections.
     *
     * @example
     * // ?name=Tom
     * // Returns a $lookup stage joining `people` collection
     * // and filtering by { name: /Tom/i }
     */
    fetchURLPopulateFilters(req: Request): ReferenceFilterPipelineStages {
        const options = this.optionService.fetchQueryParams(req);
        return this.optionService.generatePopulateFilters(options);
    }

    /**
     * Provides predefined population pipelines for movie credits.
     * Populates references to `movies`, `people`, and `roletypes`.
     *
     * @returns A {@link PopulationPipelineStages} array
     *          for enriching query results.
     *
     * @example
     * // Always applies lookups to movies, people, and roletypes,
     * // regardless of query parameters.
     */
    fetchPopulatePipelines(): PopulationPipelineStages {
        return this.optionService.generatePopulationPipelines();
    }

    /**
     * Builds MongoDB sort rules from request query parameters.
     *
     * @param req - Express request object containing query parameters.
     * @returns A record mapping {@link IMovieCredit} fields to sort orders
     *          (`1` for ascending, `-1` for descending).
     *
     * @example
     * // ?sortByMovie=1&sortByBillingOrder=-1
     * // Returns: { movie: 1, billingOrder: -1 }
     */
    fetchURLQuerySorts(req: Request): Partial<Record<keyof IMovieCredit, SortOrder>> {
        const options = this.optionService.fetchQueryParams(req);
        return this.optionService.generateQuerySorts(options);
    }
}
