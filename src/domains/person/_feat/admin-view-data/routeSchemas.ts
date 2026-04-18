/**
 * @fileoverview Route validation schemas for fetching detailed Person view data.
 * Validates the parameters required to aggregate biographical and credit information.
 */

import {z} from "zod";
import {ObjectIdSchema} from "@shared/schema/mongoose/ObjectIdSchema";
import {CoercedNonNegativeNumberSchema} from "@shared/schema/numbers/coerced-number/CoercedNonNegativeNumberSchema";

/**
 * Validation schema for the Person details route.
 */
export const PersonDetailsViewRouteConfigSchema = z.object({
    _id: ObjectIdSchema,
    limit: CoercedNonNegativeNumberSchema.optional(),
});

/**
 * Inferred TypeScript type based on the PersonDetailsRouteConfigSchema.
 */
export type PersonDetailsViewRouteConfig = z.infer<typeof PersonDetailsViewRouteConfigSchema>;