/**
 * @file MovieReview document type definitions.
 * MovieReviewTypes.ts
 */

import type { Document } from "mongoose";
import type { MovieReviewSchemaFields } from "../model/MovieReview.types.js";

/**
 * Mongoose document type for MovieReview.
 */
export type MovieReviewDocument =
    Document<unknown, {}, MovieReviewSchemaFields> &
    MovieReviewSchemaFields;