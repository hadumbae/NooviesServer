/**
 * @file Zod schema and type for standardized API request configuration.
 * @filename RequestOptionsSchema.ts
 */

import {z} from "zod";
import {URLParamBooleanSchema} from "@shared/schema/url/URLParamBooleanSchema";
import {URLParamNumberSchema} from "@shared/schema/url/URLParamNumberSchema";

/**
 * Validates the structure of global request modifiers typically passed as URL query parameters.
 * ---
 * ### Mechanics
 * * **Data Transformation:** Employs {@link URLParamBooleanSchema} and {@link URLParamNumberSchema}
 * to coerce incoming string-based query parameters into their native Boolean and Number types.
 * * **Middleware Integration:** Used by generic repository handlers to determine if Mongoose
 * `populate`, `virtuals`, or pagination logic should be applied to the query execution.
 * ---
 */
export const RequestOptionsSchema = z.object({
    /** Whether to trigger Mongoose population on document references. */
    populate: URLParamBooleanSchema,

    /** Whether to include virtual fields in the resulting JSON output. */
    virtuals: URLParamBooleanSchema,

    /** Whether the result set should be wrapped in a pagination envelope. */
    paginated: URLParamBooleanSchema,

    /** The maximum number of documents to return in a single non-paginated request. */
    limit: URLParamNumberSchema,

    /** The specific page index to retrieve for paginated queries. */
    page: URLParamNumberSchema,

    /** The number of items to display per page during pagination. */
    perPage: URLParamNumberSchema,
});

/**
 * TypeScript type inferred from {@link RequestOptionsSchema}.
 * Represents a validated configuration object for fetching domain data.
 */
export type RequestOptions = z.infer<typeof RequestOptionsSchema>;