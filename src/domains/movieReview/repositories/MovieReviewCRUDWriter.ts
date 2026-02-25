/**
 * @file MovieReview CRUD writer implementation.
 * MovieReviewCRUDWriter.ts
 */

import {CRUDWriter} from "../../../shared/repository/operations/CRUDWriter.js";
import type {MovieReviewSchemaFields} from "../model/MovieReview.types.js";
import type {
    MovieReviewCreateActionParams,
    MovieReviewCRUDWriterMethods,
    MovieReviewUpdateActionParams
} from "./MovieReviewCRUDWriter.types.js";
import {MovieReview} from "../model/MovieReview.model.js";
import {checkMovieReviewOwnership} from "../utilities/checkMovieReviewOwnership.js";
import createHttpError from "http-errors";

/**
 * Write operations for MovieReview.
 */
export class MovieReviewCRUDWriter
    extends CRUDWriter<MovieReviewSchemaFields>
    implements MovieReviewCRUDWriterMethods {

    constructor() {
        super({model: MovieReview});
    }

    async createAction(
        {userID, data, options}: MovieReviewCreateActionParams
    ): Promise<MovieReviewSchemaFields> {
        const createParams = {...data, user: userID};
        return super.createAction({data: createParams, options});
    }

    async updateAction(params: MovieReviewUpdateActionParams) {
        const {_id: reviewID, userID, ...rest} = params;

        const isSameUser = await checkMovieReviewOwnership({userID, reviewID});
        if (!isSameUser) throw createHttpError(403, "Invalid User, Can Only Update Owned Reviews.");

        return super.updateAction({_id: reviewID, ...rest});
    }
}