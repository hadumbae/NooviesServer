import {z} from "zod";

/**
 * A Zod schema for validating and transforming numeric Mongoose sort values.
 *
 * Accepts the strings `"1"` or `"-1"` and transforms them into their corresponding numbers:
 * - `"1"` → `1`
 * - `"-1"` → `-1`
 *
 * This allows for compatibility with query parameters sent as strings while still using
 * numeric values internally (as expected by Mongoose).
 *
 * @example
 * ```ts
 * MongooseNumericSortSchema.parse("1"); // => 1
 * ```
 */
export const MongooseNumericSortSchema = z.enum(["1", "-1"]).transform(v => Number(v) as 1 | -1);

/**
 * A Zod schema for validating string-based Mongoose sort values.
 *
 * Accepts the following values (case-sensitive):
 * - `"asc"`
 * - `"desc"`
 * - `"ascending"`
 * - `"descending"`
 *
 * These are the string equivalents of Mongoose sort orders.
 *
 * @example
 * ```ts
 * MongooseStringSortSchema.parse("desc"); // => "desc"
 * ```
 */
export const MongooseStringSortSchema = z.enum(["asc", "desc", "ascending", "descending"]);

/**
 * A union Zod schema that accepts either:
 * - A numeric sort value (`"1"` or `"-1"`, transformed to `1` or `-1`)
 * - A string sort value (`"asc"`, `"desc"`, `"ascending"`, `"descending"`)
 *
 * Intended for validating Mongoose-compatible sort order values passed via URL parameters.
 *
 * @example
 * ```ts
 * URLParamMongooseSortOrderSchema.parse("1");        // => 1
 * URLParamMongooseSortOrderSchema.parse("descending"); // => "descending"
 * ```
 */
export const URLParamMongooseSortOrderSchema = z.union(
    [MongooseNumericSortSchema, MongooseStringSortSchema],
    {message: "Invalid sort order."}
);