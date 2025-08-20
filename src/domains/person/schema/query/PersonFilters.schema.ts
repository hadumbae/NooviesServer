import {z} from "zod";
import {ISO3166Alpha2CodeEnumSchema} from "../../../../shared/schema/enums/country/ISO3166Alpha2CodeEnumSchema.js";
import {URLParamRegexStringSchema} from "../../../../shared/schema/url/URLParamRegexStringSchema.js";
import {URLParamObjectIDSchema} from "../../../../shared/schema/url/URLParamObjectIDSchema.js";
import {MongooseSortOrderSchema} from "../../../../shared/schema/mongoose/MongooseSortOrderSchema.js";

/**
 * Schema for filtering Person documents in queries.
 *
 * @property _id - Filters by the MongoDB ObjectID of the person.
 * @property name - Filters by the person's name using a regex string.
 * @property nationality - Optional filter by the person's nationality, represented as an ISO 3166-1 alpha-2 country code.
 */
export const PersonQueryFiltersSchema = z.object({
    _id: URLParamObjectIDSchema,
    name: URLParamRegexStringSchema,
    nationality: ISO3166Alpha2CodeEnumSchema.optional(),
});

/**
 * Schema for sorting Person documents in queries.
 *
 * @property sortByName - Optional sort order for the name field. Uses Mongoose sort order ('asc' or 'desc').
 * @property sortByNationality - Optional sort order for the nationality field. Uses Mongoose sort order ('asc' or 'desc').
 */
export const PersonQuerySortsSchema = z.object({
    sortByName: MongooseSortOrderSchema.optional(),
    sortByNationality: MongooseSortOrderSchema.optional(),
});

/**
 * Combined schema for querying Person documents.
 * Includes both filter and sort options.
 *
 * Merges {@link PersonQueryFiltersSchema} and {@link PersonQuerySortsSchema}.
 */
export const PersonQueryOptionsSchema = PersonQuerySortsSchema.merge(PersonQueryFiltersSchema);