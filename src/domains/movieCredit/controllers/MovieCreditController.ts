import type {Request, Response} from "express";
import BaseCRUDController from "../../../shared/controller/base-crud-controller/BaseCRUDController.js";
import type {IMovieCredit} from "../models/MovieCredit.interface.js";
import type MovieCreditQueryOptionService from "../services/MovieCreditQueryOptionService.js";
import type MovieCreditService from "../services/movie-credit-service/MovieCreditService.js";
import type {
    BaseControllerCRUDMethods,
    IBaseCRUDControllerConstructor
} from "../../../shared/controller/base-crud-controller/BaseControllerCRUDMethods.js";
import type {
    PopulationPipelineStages,
} from "../../../shared/types/mongoose/AggregatePipelineStages.js";
import isValidObjectId from "../../../shared/utility/mongoose/isValidObjectId.js";
import type {QueryOptionTypes} from "../../../shared/types/query-options/QueryOptionService.types.js";
import type {MovieCreditQueryMatchFilters} from "../schemas/query/MovieCreditQueryOption.types.js";

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
export interface IMovieCreditController extends BaseControllerCRUDMethods {
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
     * Builds query options for matching and referencing movie credits,
     * based on request query parameters.
     *
     * @param req - Express request object containing query parameters.
     * @returns A structured {@link QueryOptionTypes} object with filters and sorts.
     */
    fetchQueryOptions(req: Request): QueryOptionTypes<IMovieCredit, MovieCreditQueryMatchFilters> {
        const options = this.optionService.fetchQueryParams(req);
        return this.optionService.generateQueryOptions(options);
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
     * Fetches movie credits grouped by role for a specific person.
     * Uses the `limit` query parameter to control the number of credits per role.
     *
     * @param req - Express request object, expects `params.personID` and optional `query.limit`.
     * @param res - Express response object used to return JSON results.
     * @returns A Promise resolving to the HTTP response containing grouped movie credits.
     *
     * @example
     * // GET /movie-credits/person/123?limit=5
     * // Returns top 5 credits per role for person with ID 123
     */
    async fetchGroupedMovieCreditsByPerson(req: Request, res: Response): Promise<Response> {
        const {personID} = req.params;
        const {limit} = this.queryUtils.fetchOptionsFromQuery(req);

        const validPersonID = isValidObjectId(personID);

        const groupedMovieCredits = await this.service.fetchGroupedMovieCreditsByPerson({
            personID: validPersonID,
            limit,
        });

        return res.status(200).json(groupedMovieCredits);
    }
}
