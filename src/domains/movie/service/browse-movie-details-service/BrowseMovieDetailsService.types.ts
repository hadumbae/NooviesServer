/**
 * @file Parameter types for browse movie details services.
 * BrowseMovieDetailsService.types.ts
 */

import {Types} from "mongoose";
import type {RequestOptions} from "../../../../shared/types/request-options/RequestOptions.js";

/**
 * Input parameters for fetching movie reviews.
 */
export type BrowseReviewsByMovieParams = {
    page: number;
    perPage: number;
    movieID: Types.ObjectId;
    options?: Pick<RequestOptions, "populate" | "virtuals">;
}