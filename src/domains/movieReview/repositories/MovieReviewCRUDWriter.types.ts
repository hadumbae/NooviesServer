/**
 * @file Types for MovieReview CRUD writer.
 * MovieReviewCRUDWriter.types.ts
 */

import type { MovieReviewCreateInputData } from "../schema/MovieReviewCreateInputSchema.js";
import { Types } from "mongoose";
import type { MovieReviewSchemaFields } from "../model/MovieReview.types.js";
import type {CRUDCreateParams, WriteMethods} from "../../../shared/repository/operations/CRUDWriter.types.js";

/**
 * Parameters for creating a MovieReview.
 */
export type MovieReviewCreateActionParams = Pick<CRUDCreateParams, "options"> & {
    userID: Types.ObjectId;
    data: MovieReviewCreateInputData;
};

/**
 * Write operations contract for MovieReview.
 */
export interface MovieReviewCRUDWriterMethods extends WriteMethods<MovieReviewSchemaFields>{
    createAction(params: MovieReviewCreateActionParams): Promise<MovieReviewSchemaFields>;
}