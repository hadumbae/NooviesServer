/**
 * @fileoverview Defines the schema for movie information view route configuration.
 */

import {z} from "zod";
import {SlugStringSchema} from "@shared/schema/strings/SlugStringSchema";
import {PositiveIntegerSchema} from "@shared/schema/numbers/PositiveIntegerSchema";

/** Zod schema for validating movie information route parameters. */
export const MovieInfoViewRouteConfigSchema = z.object({
    slug: SlugStringSchema,
    reviewPage: PositiveIntegerSchema.optional(),
    reviewPerPage: PositiveIntegerSchema.optional(),
});

/** Configuration object for the movie information view route. */
export type MovieInfoViewRouteConfig = z.infer<typeof MovieInfoViewRouteConfigSchema>;