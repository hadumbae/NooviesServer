import { z } from "zod";
import { ISO3166Alpha2CountryCodeSchema } from "../../../../shared/schema/enums/ISO3166Alpha2CountryCodeSchema.js";
import { URLParamRegexStringSchema } from "../../../../shared/schema/url/URLParamRegexStringSchema.js";
import { URLParamObjectIDSchema } from "../../../../shared/schema/url/URLParamObjectIDSchema.js";
import { URLParamMongooseSortOrderSchema } from "../../../../shared/schema/url/URLParamMongooseSortOrderSchema.js";

/**
 * Filters that can be applied when querying Person documents.
 */
export const PersonQueryMatchFiltersSchema = z.object({
    /** Filter by MongoDB ObjectID (_id) of the person. */
    _id: URLParamObjectIDSchema,

    /** Filter by person name using a regex string. */
    name: URLParamRegexStringSchema,

    /** Filter by nationality using ISO 3166-1 alpha-2 country codes (optional). */
    nationality: ISO3166Alpha2CountryCodeSchema.optional(),
});

/**
 * Sorting options when querying Person documents.
 */
export const PersonQueryMatchSortsSchema = z.object({
    /** Sort persons by name in ascending or descending order. */
    sortByName: URLParamMongooseSortOrderSchema,

    /** Sort persons by nationality in ascending or descending order. */
    sortByNationality: URLParamMongooseSortOrderSchema,
});

/**
 * Combined schema for Person query options including filters and sorting.
 */
export const PersonQueryOptionsSchema = PersonQueryMatchSortsSchema.merge(PersonQueryMatchFiltersSchema);
