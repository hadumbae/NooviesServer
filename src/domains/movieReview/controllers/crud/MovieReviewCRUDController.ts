/**
 * @file MovieReview CRUD controller.
 * MovieReviewCRUDController.ts
 */

import BaseCRUDController from "../../../../shared/controller/base-crud-controller/BaseCRUDController.js";
import type { MovieReviewSchemaFields } from "../../model/MovieReview.types.js";
import type {
    BaseControllerCRUDMethods,
    BaseCRUDControllerConstructorParams,
} from "../../../../shared/controller/base-crud-controller/BaseControllerCRUDMethods.js";

/**
 * CRUD controller for MovieReview.
 */
export class MovieReviewCRUDController
    extends BaseCRUDController<MovieReviewSchemaFields>
    implements BaseControllerCRUDMethods<MovieReviewSchemaFields> {

    constructor(params: BaseCRUDControllerConstructorParams<MovieReviewSchemaFields>) {
        super(params);
    }
}