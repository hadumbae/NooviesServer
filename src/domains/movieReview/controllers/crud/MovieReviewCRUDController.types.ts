/**
 * @file Type definitions for MovieReview CRUD controller.
 * MovieReviewCRUDController.types.ts
 */

import type {
    BaseCRUDControllerConstructorParams
} from "../../../../shared/controller/base-crud-controller/BaseControllerCRUDMethods.js";
import type {MovieReviewSchemaFields} from "../../model/MovieReview.types.js";
import type {MovieReviewQueryOptionService} from "../../services/query-options/MovieReviewQueryOptionService.js";

/**
 * Constructor parameters for a MovieReview CRUD controller.
 */
export type MovieReviewCRUDConstructorParams =
    BaseCRUDControllerConstructorParams<MovieReviewSchemaFields> & {
    optionService: MovieReviewQueryOptionService;
};