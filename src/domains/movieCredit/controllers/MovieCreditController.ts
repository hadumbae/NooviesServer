import type {Request} from "express";
import BaseCRUDController from "../../../shared/controller/base-crud-controller/BaseCRUDController.js";
import type {IMovieCredit} from "../models/MovieCredit.interface.js";
import type MovieCreditQueryOptionService from "../services/MovieCreditQueryOptionService.js";
import type MovieCreditService from "../services/MovieCreditService.js";
import type {
    IBaseCRUDController,
    IBaseCRUDControllerConstructor
} from "../../../shared/controller/base-crud-controller/BaseCRUDController.types.js";
import type {FilterQuery} from "mongoose";
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
    /** Service responsible for handling query options such as filters and population. */
    optionService: MovieCreditQueryOptionService;
}

/**
 * Interface for a Movie Credit Controller.
 * Extends the base CRUD controller and adds specific movie credit services.
 */
export interface IMovieCreditController extends IBaseCRUDController {
    /** Service for CRUD operations. */
    service: MovieCreditService;
    /** Service for handling query options and filters. */
    optionService: MovieCreditQueryOptionService;
}

/**
 * Controller for handling Movie Credit related requests.
 * Extends {@link BaseCRUDController} and provides
 * filter and population logic specific to movie credits.
 */
export default class MovieCreditController
    extends BaseCRUDController<IMovieCredit>
    implements IMovieCreditController
{
    /** Service for CRUD operations on movie credits. */
    service: MovieCreditService;

    /** Service for extracting and generating query options. */
    optionService: MovieCreditQueryOptionService;

    /**
     * Creates a new {@link MovieCreditController}.
     *
     * @param params - The constructor parameters including service and optionService.
     */
    constructor(params: IMovieCreditControllerConstructor) {
        const { service, optionService, ...superParams } = params;
        super(superParams);

        this.service = service;
        this.optionService = optionService;
    }

    /**
     * Extracts and builds MongoDB match filters from the request query parameters.
     *
     * @param req - The Express request object.
     * @returns A MongoDB filter query for matching documents.
     */
    fetchURLMatchFilters(req: Request): FilterQuery<any> {
        const options = this.optionService.fetchQueryParams(req);
        return this.optionService.generateMatchFilters(options);
    }

    /**
     * Extracts and builds MongoDB populate filters from the request query parameters.
     *
     * @param req - The Express request object.
     * @returns A set of populate pipeline stages for MongoDB aggregation.
     */
    fetchURLPopulateFilters(req: Request): ReferenceFilterPipelineStages {
        const options = this.optionService.fetchQueryParams(req);
        return this.optionService.generatePopulateFilters(options);
    }

    /**
     * Returns predefined population pipelines for movie credits.
     *
     * @returns A set of populate pipeline stages for MongoDB aggregation.
     */
    fetchPopulatePipelines(): PopulationPipelineStages {
        return this.optionService.generatePopulationPipelines();
    }
}