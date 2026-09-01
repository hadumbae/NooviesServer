/**
 * @fileoverview Zod schema for validating route configuration parameters for the movie showings view.
 */

import {StringValueSchema} from "@/shared/schema/strings/StringValueSchema";
import {ISO3166Alpha2CountryCodeSchema} from "@/shared/schema/enums/ISO3166Alpha2CountryCodeSchema";
import {z} from "zod";
import {PositiveIntegerSchema} from "@/shared/_schema/numbers/numbers/PositiveIntegerSchema";
import {SlugStringSchema} from "@/shared/schema/strings/SlugStringSchema";
import {preprocessToNumber} from "@/shared/_feat/zod-preprocessors/preprocessToNumber";
import {preprocessOptionalField} from "@/shared/_feat";

/** Schema for movie showing route parameters including location and pagination. */
export const MovieInfoShowingsViewRouteConfigSchema = z.object({
    slug: SlugStringSchema,
    near: preprocessOptionalField(StringValueSchema.max(250, "Must be 250 characters or less.")),
    country: preprocessOptionalField(ISO3166Alpha2CountryCodeSchema).default("US"),
    page: preprocessToNumber(PositiveIntegerSchema.optional()).optional().default(1),
    perPage: preprocessToNumber(PositiveIntegerSchema.optional()).optional().default(10),
});

/** Type definition for the movie info showings view route configuration. */
export type MovieInfoShowingsViewRouteConfig = z.infer<typeof MovieInfoShowingsViewRouteConfigSchema>;