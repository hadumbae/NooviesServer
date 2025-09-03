import {z} from "zod";

/**
 * Zod schema for validating and transforming **numeric Mongoose sort values**.
 *
 * Accepts the strings `"1"` or `"-1"` and transforms them into their corresponding numeric values:
 * - `"1"` → `1`
 * - `"-1"` → `-1`
 *
 * This is useful for query parameters sent as strings (e.g., from URLs) while keeping
 * numeric sort values compatible with Mongoose.
 *
 * @example
 * ```ts
 * MongooseNumericSortSchema.parse("1");  // => 1
 * MongooseNumericSortSchema.parse("-1"); // => -1
 * ```
 */
export const MongooseNumericSortSchema = z
    .enum(["1", "-1"], {message: "Invalid sort order."})
    .transform(v => Number(v) as 1 | -1);

/**
 * Zod schema for validating **string-based Mongoose sort values**.
 *
 * Accepts the following values (case-sensitive):
 * - `"asc"` (ascending)
 * - `"desc"` (descending)
 * - `"ascending"` (alternative ascending)
 * - `"descending"` (alternative descending)
 *
 * Useful for validating human-readable sort directions in query parameters.
 *
 * @example
 * ```ts
 * MongooseStringSortSchema.parse("asc");        // => "asc"
 * MongooseStringSortSchema.parse("descending"); // => "descending"
 * ```
 */
export const MongooseStringSortSchema = z
    .enum(["asc", "desc", "ascending", "descending"], {message: "Invalid sort order."});

/**
 * Zod schema for validating a **URL parameter sort order** compatible with Mongoose.
 *
 * Accepts either:
 * - A numeric sort value (`"1"` or `"-1"`, transformed to `1` or `-1`)
 * - A string sort value (`"asc"`, `"desc"`, `"ascending"`, `"descending"`)
 *
 * Optional by default; useful for API endpoints that accept flexible sort query parameters.
 *
 * @example
 * ```ts
 * URLParamMongooseSortOrderSchema.parse("1");          // => 1
 * URLParamMongooseSortOrderSchema.parse("-1");         // => -1
 * URLParamMongooseSortOrderSchema.parse("desc");       // => "desc"
 * URLParamMongooseSortOrderSchema.parse("ascending");  // => "ascending"
 * ```
 */
export const URLParamMongooseSortOrderSchema = z
    .union([MongooseNumericSortSchema, MongooseStringSortSchema], { message: "Invalid sort order." })
    .optional();