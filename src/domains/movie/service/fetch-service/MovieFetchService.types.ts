/**
 * @file Parameter types for Movie fetch operations.
 * MovieFetchService.types.ts
 */

import { Types } from "mongoose";
import type { SlugString } from "../../../../shared/schema/strings/SlugStringSchema.js";

/**
 * Query modifiers for Movie fetches.
 */
type QueryOptions = {
    lean?: boolean;
    select?: string;
};

/**
 * Params for fetching a required Movie by `_id`.
 */
export type FetchRequiredMovieParams = {
    _id: Types.ObjectId;
    options?: QueryOptions
};

/**
 * Params for fetching a required Movie by `slug`.
 */
export type FetchRequiredMovieBySlugParams = {
    slug: SlugString;
    options?: QueryOptions;
};