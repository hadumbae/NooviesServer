/**
 * @file Create a filter matching by _id or slug.
 * buildIdOrSlugFilter.ts
 */

import { type FilterQuery, Types } from "mongoose";

/**
 * Builds a MongoDB filter that matches either `_id` or `slug`.
 *
 * @param identifier - ObjectId or slug
 */
export function buildIdOrSlugFilter<TFilter>(identifier: Types.ObjectId | string): FilterQuery<TFilter> {
    return {
        $or: [
            { _id: identifier },
            { slug: identifier }
        ]
    };
}