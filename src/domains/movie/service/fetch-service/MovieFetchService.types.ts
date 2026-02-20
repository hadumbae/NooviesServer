/**
 * @file Type definitions for MovieFetchService.
 * MovieFetchService.types.ts
 */

import { Types } from "mongoose";
import type { SlugString } from "../../../../shared/schema/strings/SlugStringSchema.js";

/**
 * Parameters for fetching a required Movie.
 */
export type FetchRequiredMovieParams = {
    _id: Types.ObjectId | SlugString;
    lean?: boolean;
    select?: string;
};