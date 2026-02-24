/**
 * @file MovieReview CRUD writer implementation.
 * MovieReviewCRUDWriter.ts
 */

import {CRUDWriter} from "../../../shared/repository/operations/CRUDWriter.js";
import type {MovieReviewSchemaFields} from "../model/MovieReview.types.js";
import type {MovieReviewCreateActionParams, MovieReviewCRUDWriterMethods} from "./MovieReviewCRUDWriter.types.js";
import {MovieReviewModel} from "../model/MovieReview.model.js";

/**
 * Write operations for MovieReview.
 */
export class MovieReviewCRUDWriter
    extends CRUDWriter<MovieReviewSchemaFields>
    implements MovieReviewCRUDWriterMethods {

    constructor() {
        super({model: MovieReviewModel});
    }

    async createAction(
        {userID, data, options}: MovieReviewCreateActionParams
    ): Promise<MovieReviewSchemaFields> {
        const createParams = {...data, user: userID};
        return super.createAction({data: createParams, options});
    }
}