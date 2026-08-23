/**
 * @fileoverview Route parameter validation schema for the theatre screen detail view.
 */

import {z} from "zod";
import {SlugStringSchema} from "@/shared/schema/strings/SlugStringSchema";
import {PositiveIntegerSchema} from "@/shared/_schema";

/**
 * Validation schema for ensuring both theatre and screen identifiers are present and valid slugs.
 */
export const TheatreScreenDetailsViewRouteConfigSchema = z.object({
    theatreSlug: SlugStringSchema,
    screenSlug: SlugStringSchema,
    recentShowingsCount: PositiveIntegerSchema.min(20, "`recentShowingsCount` must not exceed 20.").optional().catch(10),
});

/**
 * Type definition inferred from the theatre screen route configuration schema.
 */
export type TheatreScreenDetailsViewRouteConfig = z.infer<typeof TheatreScreenDetailsViewRouteConfigSchema>;