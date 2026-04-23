/**
 * @fileoverview Validation schema and type definitions for the Theatre Details view routing configuration.
 */

import {z} from "zod";
import {SlugStringSchema} from "@shared/schema/strings/SlugStringSchema";
import {CoercedNonNegativeNumberSchema} from "@shared/schema/numbers/coerced-number/CoercedNonNegativeNumberSchema";

/**
 * Zod schema for validating the route and search parameters of the Theatre Details page.
 */
export const TheatreDetailsViewRouteConfigSchema = z.object({
    slug: SlugStringSchema,
    screenPage: CoercedNonNegativeNumberSchema.optional(),
    screenPerPage: CoercedNonNegativeNumberSchema.optional(),
    showingLimit: CoercedNonNegativeNumberSchema.optional(),
});

/**
 * Type definition for the Theatre Details route configuration, inferred from the schema.
 */
export type TheatreDetailsViewRouteConfig = z.infer<typeof TheatreDetailsViewRouteConfigSchema>;