/**
 * @fileoverview Defines the schema and type for the movie info credits view route configuration.
 */

import {z} from "zod";
import {SlugStringSchema} from "@/schema/strings/SlugStringSchema";

/** Zod validation schema for the movie info credits view route configuration. */
export const MovieInfoCreditsViewRouteConfigSchema = z.object({
    slug: SlugStringSchema,
});

/** Type definition for the movie info credits view route configuration. */
export type MovieInfoCreditsViewRouteConfig = z.infer<typeof MovieInfoCreditsViewRouteConfigSchema>;