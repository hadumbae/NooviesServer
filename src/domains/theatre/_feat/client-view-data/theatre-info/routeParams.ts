/**
 * @fileoverview Zod schema for validating theatre info view route parameters.
 */

import {z} from "zod";
import {SlugStringSchema} from "@shared/schema/strings/SlugStringSchema";
import {SimpleDateStringSchema} from "@shared/schema/date-time/SimpleDateStringSchema";
import {CoercedNonNegativeNumberSchema} from "@shared/schema/numbers/coerced-number/CoercedNonNegativeNumberSchema";

/** Zod schema for validating theatre info view route parameters. */
export const FetchTheatreInfoViewRouteConfigSchema = z.object({
    theatreSlug: SlugStringSchema,
    localDateString: SimpleDateStringSchema,
    limit: CoercedNonNegativeNumberSchema.optional(),
});

/** Type definition for the theatre info view route parameters. */
export type FetchTheatreInfoViewRouteConfig = z.infer<typeof FetchTheatreInfoViewRouteConfigSchema>;