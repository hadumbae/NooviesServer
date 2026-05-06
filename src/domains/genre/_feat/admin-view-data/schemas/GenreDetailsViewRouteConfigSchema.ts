/**
 * @fileoverview Zod schema defining the route parameters for the genre details view, extending request pagination options with a slug.
 */

import {z} from "zod";
import {
    RequestPaginationOptionsSchema
} from "@shared/_feat/fetch-request-options/schemas/RequestPaginationOptionsSchema";
import {SlugStringSchema} from "@shared/schema/strings/SlugStringSchema";

/** Zod schema defining the route configuration properties for the genre details view. */
export const GenreDetailsViewRouteConfigSchema = RequestPaginationOptionsSchema.extend({
    slug: SlugStringSchema,
});

/** Inferred type representing the validated route parameters for the genre details view. */
export type GenreDetailsViewRouteConfig = z.infer<typeof GenreDetailsViewRouteConfigSchema>;