/**
 * @file Movie review document field types.
 * MovieReview.types.ts
 */

import {Types} from "mongoose";

/**
 * Movie review document fields.
 */
export interface MovieReviewSchemaFields {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    movie: Types.ObjectId;
    displayName: string;
    rating: number;
    summary: string;
    reviewText?: string;
    isRecommended?: boolean;
    helpfulLikes: Types.ObjectId[];
}