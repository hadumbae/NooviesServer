import { z } from "zod";
import { ISO3166Alpha2CountryCodeSchema } from "../../../../shared/schema/enums/ISO3166Alpha2CountryCodeSchema.js";
import { URLParamRegexStringSchema } from "../../../../shared/schema/url/URLParamRegexStringSchema.js";
import { URLParamObjectIDSchema } from "../../../../shared/schema/url/URLParamObjectIDSchema.js";
import { URLParamMongooseSortOrderSchema } from "../../../../shared/schema/url/URLParamMongooseSortOrderSchema.js";
import { URLParamDateOnlySchema } from "../../../../shared/schema/url/URLParamDateOnlySchema.js";

/**
 * **PersonQueryMatchFiltersSchema**
 *
 * Zod schema defining all **filter parameters** that can be used
 * when querying `Person` documents.
 *
 * ### Fields
 * - `_id` — MongoDB ObjectID as a URL parameter.
 * - `name` — Case-insensitive regex filter for a person’s name.
 * - `dob` — Date of birth, represented as a date-only value (`YYYY-MM-DD`).
 * - `nationality` — ISO 3166-1 alpha-2 country code (optional).
 *
 * ### Example
 * ```ts
 * {
 *   _id: "653fa8d7c4e63b1a87e77e45",
 *   name: "John",
 *   dob: "1990-05-22",
 *   nationality: "US"
 * }
 * ```
 */
export const PersonQueryMatchFiltersSchema = z.object({
    _id: URLParamObjectIDSchema,
    name: URLParamRegexStringSchema,
    dob: URLParamDateOnlySchema,
    nationality: ISO3166Alpha2CountryCodeSchema.optional(),
});

/**
 * **PersonQueryMatchSortsSchema**
 *
 * Zod schema defining all **sorting parameters** applicable
 * when fetching `Person` documents from the database.
 *
 * ### Fields
 * - `sortByName` — Sort order by name (`asc` or `desc`).
 * - `sortByDOB` — Sort order by date of birth (`asc` or `desc`).
 * - `sortByNationality` — Sort order by nationality (`asc` or `desc`).
 *
 * ### Example
 * ```ts
 * {
 *   sortByName: "asc",
 *   sortByDOB: "desc"
 * }
 * ```
 */
export const PersonQueryMatchSortsSchema = z.object({
    sortByName: URLParamMongooseSortOrderSchema,
    sortByDOB: URLParamMongooseSortOrderSchema,
    sortByNationality: URLParamMongooseSortOrderSchema,
});

/**
 * **PersonQueryOptionsSchema**
 *
 * Combined Zod schema merging both:
 * - {@link PersonQueryMatchFiltersSchema} — Filtering options.
 * - {@link PersonQueryMatchSortsSchema} — Sorting options.
 *
 * Used to validate full query parameters for fetching `Person` documents.
 *
 * ### Example
 * ```ts
 * {
 *   name: "Anna",
 *   dob: "1985-03-14",
 *   sortByName: "asc"
 * }
 * ```
 */
export const PersonQueryOptionsSchema =
    PersonQueryMatchSortsSchema.merge(PersonQueryMatchFiltersSchema);
