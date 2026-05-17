/**
 * @fileoverview Zod schema for validating route configuration parameters for the movie showings view.
 */

import {SlugStringSchema} from "@/schema/strings/SlugStringSchema";
import {StringValueSchema} from "@/schema/strings/StringValueSchema";
import {ISO3166Alpha2CountryCodeSchema} from "@/schema/enums/ISO3166Alpha2CountryCodeSchema";
import {z} from "zod";
import {preprocessToNumber} from "@/_feat/zod-preprocessors";
import {PositiveIntegerSchema} from "@/schema/numbers/PositiveIntegerSchema";

/** Schema for movie showing route parameters including location and pagination. */
export const MovieInfoShowingsViewRouteConfigSchema = z.object({
    slug: SlugStringSchema,
    near: StringValueSchema.max(250, "Must be 250 characters or less.").optional(),
    country: ISO3166Alpha2CountryCodeSchema,
    page: preprocessToNumber(PositiveIntegerSchema),
    perPage: preprocessToNumber(PositiveIntegerSchema),
});

/** Type definition for the movie info showings view route configuration. */
export type MovieInfoShowingsViewRouteConfig = z.infer<typeof MovieInfoShowingsViewRouteConfigSchema>;