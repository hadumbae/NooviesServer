/**
 * @file MovieReview schema field typings.
 * MovieReview.types.ts
 */

import { Types } from "mongoose";

/**
 * Field shape for MovieReview documents.
 */
export interface MovieReviewSchemaFields {
    user: Types.ObjectId;
    movie: Types.ObjectId;
    rating: number;
    reviewText?: string;
    isRecommended?: boolean;
    helpfulVotes?: number;
}