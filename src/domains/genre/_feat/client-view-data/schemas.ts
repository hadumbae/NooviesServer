/**
 * @fileoverview Zod validation schema for the Genre Details public view request.
 * Combines route parameter requirements with standard pagination query options.
 */

import {z} from "zod";
import {SlugStringSchema} from "@shared/schema/strings/SlugStringSchema";
import {
    RequestPaginationOptionsSchema
} from "@shared/_feat/fetch-request-options/schemas/RequestPaginationOptionsSchema";

/**
 * Validation schema for the Genre-specific browsing endpoint.
 */
export const BrowseGenreWithMoviesRouteParamSchema = RequestPaginationOptionsSchema.extend({
    slug: SlugStringSchema,
});

/**
 * TypeScript type inferred from {@link BrowseGenreWithMoviesRouteParamSchema}.
 */
export type BrowseGenreWithMoviesRouteParams = z.infer<typeof BrowseGenreWithMoviesRouteParamSchema>;