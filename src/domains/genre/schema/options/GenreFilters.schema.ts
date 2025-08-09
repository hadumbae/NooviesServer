import {z} from "zod";
import {URLParamStringSchema} from "../../../../shared/schema/url/URLParamStringSchema.js";
import {MongooseSortOrderSchema} from "../../../../shared/schema/mongoose/MongooseSortOrderSchema.js";

/**
 * Schema for filtering genres by query parameters.
 *
 * @remarks
 * This schema currently supports filtering genres by their `name` field.
 * The `name` parameter is validated using {@link URLParamStringSchema},
 * ensuring it is properly formatted for use in a URL.
 */
export const GenreQueryFiltersSchema = z.object({
    /** Name of the genre to filter by, taken from a URL query parameter. */
    name: URLParamStringSchema
});

/**
 * Schema for specifying sorting options when querying genres.
 *
 * @remarks
 * This schema allows specifying a sort order for the genre `name` field.
 * The `MongooseSortOrderSchema` ensures the sort order is compatible with Mongoose
 * (e.g., `1` for ascending, `-1` for descending).
 */
export const GenreQuerySortsSchema = z.object({
    /** Sort order for the `name` field (ascending or descending). */
    sortByName: MongooseSortOrderSchema.optional(),
});

/**
 * Combined schema for genre query parameters.
 *
 * @remarks
 * This schema merges both {@link GenreQueryFiltersSchema} and {@link GenreQuerySortsSchema},
 * allowing both filtering and sorting options to be specified in a single object.
 */
export const GenreQueryOptionsSchema = GenreQuerySortsSchema.merge(GenreQueryFiltersSchema);