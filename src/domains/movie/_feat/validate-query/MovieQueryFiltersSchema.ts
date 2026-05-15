/**
 * @fileoverview Defines the Zod schema for validating movie search query parameters.
 */

import {z} from "zod";
import {URLParamObjectIDSchema} from "@shared/schema/url/URLParamObjectIDSchema";
import {URLParamDateOnlySchema} from "@shared/schema/url/URLParamDateOnlySchema";
import generateURLParamArraySchema from "@shared/utility/schema/url-params/generateURLParamArraySchema";
import {ObjectIdSchema} from "@shared/schema/mongoose/ObjectIdSchema";
import {URLParamBooleanSchema} from "@shared/schema/url/URLParamBooleanSchema";
import {ISO3166Alpha2CountryCodeSchema} from "@shared/schema/enums/ISO3166Alpha2CountryCodeSchema";
import {URLParamRegexPatternSchema} from "@shared/_feat/parse-query-string";

/** Zod schema for validating and parsing movie filter criteria from URL parameters. */
export const MovieQueryFiltersSchema = z.object({
    _id: URLParamObjectIDSchema,
    title: URLParamRegexPatternSchema,
    releaseDate: URLParamDateOnlySchema,
    genres: generateURLParamArraySchema(ObjectIdSchema),
    originalTitle: URLParamRegexPatternSchema,
    isReleased: URLParamBooleanSchema,
    country: ISO3166Alpha2CountryCodeSchema.optional(),
    isAvailable: URLParamBooleanSchema,
});

/** Type definition for movie query filters inferred from the schema. */
export type MovieQueryFilters = z.infer<typeof MovieQueryFiltersSchema>;