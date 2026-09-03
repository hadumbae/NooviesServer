/**
 * @fileoverview Zod schema for validating theatre info view route parameters.
 */

import {z} from "zod";
import {preprocessOptionalField} from "@/shared/_feat";
import {SlugStringSchema} from "@/shared/schema/strings/SlugStringSchema";
import {SimpleDateStringSchema} from "@/shared/schema/date-time/SimpleDateStringSchema";
import {CoercedNonNegativeNumberSchema} from "@/shared/_schema/numbers/coerced-number/CoercedNonNegativeNumberSchema";

/** Zod schema for validating theatre info view route parameters. */
export const FetchTheatreInfoViewRouteConfigSchema = z.object({
    theatreSlug: SlugStringSchema,
    localDateString: SimpleDateStringSchema,
    limit: preprocessOptionalField(CoercedNonNegativeNumberSchema.max(10)).default(3).catch(3),
});

/** Type definition for the theatre info view route parameters. */
export type FetchTheatreInfoViewRouteConfig = z.infer<typeof FetchTheatreInfoViewRouteConfigSchema>;