/**
 * @file MovieReview CRUD controller.
 * MovieReviewCRUDController.ts
 */

import type {Request} from "express";
import BaseCRUDController from "../../../../shared/controller/base-crud-controller/BaseCRUDController.js";
import type { MovieReviewSchemaFields } from "../../model/MovieReview.types.js";
import type {BaseControllerCRUDMethods,} from "../../../../shared/controller/base-crud-controller/BaseControllerCRUDMethods.js";
import type {MovieReviewCRUDConstructorParams} from "./MovieReviewCRUDController.types.js";
import type {MovieReviewQueryOptionService} from "../../services/query-options/MovieReviewQueryOptionService.js";
import type {QueryOptionTypes} from "../../../../shared/types/query-options/QueryOptionService.types.js";
import type {MovieReviewMatchQueryFilters} from "../../schema/query-options/MovieReviewMatchQuerySchemas.js";

/**
 * CRUD controller for MovieReview.
 */
export class MovieReviewCRUDController
    extends BaseCRUDController<MovieReviewSchemaFields>
    implements BaseControllerCRUDMethods<MovieReviewSchemaFields> {

    protected optionService: MovieReviewQueryOptionService;

    constructor({optionService, ...superParams}: MovieReviewCRUDConstructorParams) {
        super(superParams);
        this.optionService = optionService;
    }

    fetchQueryOptions(req: Request): QueryOptionTypes<MovieReviewSchemaFields, MovieReviewMatchQueryFilters> {
        const options = this.optionService.fetchQueryParams(req);
        return this.optionService.generateQueryOptions(options);
    }
}