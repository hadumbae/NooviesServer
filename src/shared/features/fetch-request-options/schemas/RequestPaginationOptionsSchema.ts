/**
 * @file Zod schema and type definition for standard request-based pagination parameters.
 * @filename RequestPaginationOptionsSchema.ts
 */

import {z} from "zod";
import {CoercedPositiveNumberSchema} from "@shared/schema/numbers/coerced-number/CoercedPositiveNumberSchema";

/**
 * Validates and transforms incoming pagination parameters.
 * ---
 */
export const RequestPaginationOptionsSchema = z.object({
    /** The current page index (1-based). */
    page: CoercedPositiveNumberSchema,

    /** The number of records to retrieve per result set. */
    perPage: CoercedPositiveNumberSchema,
});

/**
 * TypeScript type inferred from the RequestPaginationOptionsSchema.
 */
export type RequestPaginationOptions = z.infer<typeof RequestPaginationOptionsSchema>;