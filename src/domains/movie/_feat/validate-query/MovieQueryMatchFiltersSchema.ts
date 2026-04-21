/**
 * @fileoverview Validation schema for filtering Movie entities in database queries.
 * Provides a comprehensive set of filters for catalog management and customer search.
 */

import {z} from "zod";
import {URLParamObjectIDSchema} from "@shared/schema/url/URLParamObjectIDSchema";
import {URLParamDateOnlySchema} from "@shared/schema/url/URLParamDateOnlySchema";
import generateURLParamArraySchema from "@shared/utility/schema/url-params/generateURLParamArraySchema";
import {ObjectIdSchema} from "@shared/schema/mongoose/ObjectIdSchema";
import {URLParamBooleanSchema} from "@shared/schema/url/URLParamBooleanSchema";
import {ISO3166Alpha2CountryCodeSchema} from "@shared/schema/enums/ISO3166Alpha2CountryCodeSchema";
import {URLParamRegexPatternSchema} from "@shared/_feat/parse-query-string";

/**
 * Zod schema defining the available match filters for Movie queries.
 */
export const MovieQueryMatchFiltersSchema = z.object({
    _id: URLParamObjectIDSchema,
    title: URLParamRegexPatternSchema,
    releaseDate: URLParamDateOnlySchema,
    genres: generateURLParamArraySchema(ObjectIdSchema),
    originalTitle: URLParamRegexPatternSchema,
    isReleased: URLParamBooleanSchema,
    country: ISO3166Alpha2CountryCodeSchema.optional(),
    isAvailable: URLParamBooleanSchema,
});

/**
 * TypeScript type inferred from MovieQueryMatchFiltersSchema.
 */
export type MovieQueryMatchFilters = z.infer<typeof MovieQueryMatchFiltersSchema>;