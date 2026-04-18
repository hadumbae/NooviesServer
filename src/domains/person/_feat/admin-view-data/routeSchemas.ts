/**
 * @fileoverview Route validation schemas for fetching detailed Person view data.
 * Validates the parameters required to aggregate biographical and credit information.
 */

import {z} from "zod";
import {CoercedNonNegativeNumberSchema} from "@shared/schema/numbers/coerced-number/CoercedNonNegativeNumberSchema";
import {SlugStringSchema} from "@shared/schema/strings/SlugStringSchema";

/**
 * Validation schema for the Person details route.
 */
export const PersonDetailsViewRouteConfigSchema = z.object({
    slug: SlugStringSchema,
    limit: CoercedNonNegativeNumberSchema.optional(),
});

/**
 * Inferred TypeScript type based on the PersonDetailsRouteConfigSchema.
 */
export type PersonDetailsViewRouteConfig = z.infer<typeof PersonDetailsViewRouteConfigSchema>;