/**
 * @fileoverview Route parameter validation schema for the theatre screen detail view.
 */

import {z} from "zod";
import {SlugStringSchema} from "@shared/schema/strings/SlugStringSchema";

/**
 * Validation schema for ensuring both theatre and screen identifiers are present and valid slugs.
 */
export const TheatreScreenViewRouteConfigSchema = z.object({
    theatreSlug: SlugStringSchema,
    screenSlug: SlugStringSchema,
});

/**
 * Type definition inferred from the theatre screen route configuration schema.
 */
export type TheatreScreenViewRouteConfig = z.infer<typeof TheatreScreenViewRouteConfigSchema>;