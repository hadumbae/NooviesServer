/**
 * @file MovieReview write-layer type contracts.
 * MovieReviewCRUDWriter.types.ts
 */

import type { MovieReviewCreateInputData } from "../schema/MovieReviewCreateInputSchema.js";
import { Types } from "mongoose";
import type { MovieReviewSchemaFields } from "../model/MovieReview.types.js";
import type {
    CRUDCreateParams,
    CRUDUpdateActionParams,
    WriteMethods,
} from "../../../shared/repository/operations/CRUDWriter.types.js";
import type { MovieReviewUpdateInputData } from "../schema/MovieReviewUpdateInputSchema.js";

/**
 * Parameters for MovieReview create operations.
 */
export type MovieReviewCreateActionParams = Pick<CRUDCreateParams, "options"> & {
    userID: Types.ObjectId;
    data: MovieReviewCreateInputData;
};

/**
 * Parameters for MovieReview update operations.
 */
export type MovieReviewUpdateActionParams = Omit<CRUDUpdateActionParams, "data"> & {
    userID: Types.ObjectId;
    data: MovieReviewUpdateInputData;
};

/**
 * Write operation contract for MovieReview.
 */
export interface MovieReviewCRUDWriterMethods extends WriteMethods<MovieReviewSchemaFields> {
    createAction(params: MovieReviewCreateActionParams): Promise<MovieReviewSchemaFields>;
    updateAction(params: MovieReviewUpdateActionParams): Promise<MovieReviewSchemaFields>;
}